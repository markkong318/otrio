import Peer, {MeshRoom} from 'skyway-js';
import {v4 as uuidv4} from 'uuid';

import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import {RoomModel} from '../model/room-model';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_SERVER_START} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {RoomGameController} from './room-game-controller';

export class RoomController extends Controller {
  private roomModel: RoomModel;
  private roomGameController: RoomGameController;

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_SERVER_START, () => this.startServer());
  }

  isAdmin() {
    return !!this.room;
  }

  startServer() {
    this.createRoom();
  }

  createRoom() {
    const roomId = uuidv4();

    this.peer = new Peer({
      key: API_KEY,
      // debug: 3,
    });

    this.peer.on('open', () => {
      console.log('server peer id:' + this.peer.id);

      this.room = this.peer.joinRoom(roomId, {
        mode: 'mesh',
      });

      this.room.on("open", () => this.onRoomOpen());
      this.room.on('peerJoin', peerId => this.onRoomPeerJoin(peerId));
      this.room.on('peerLeave', peerId => this.onRoomPeerLeave(peerId));
      this.room.on('data', ({data, src}) => this.onRoomData({data, src}));
    });
  }

  onRoomOpen() {
    console.log(`[server] room ${this.room.name} is created`);
    event.emit(EVENT_CLIENT_START, new EventClientStartMsg(this.room.name));
  }

  onRoomPeerJoin(peerId) {
    console.log(`[server] peer ${peerId} is joined`);
    this.roomModel.peerIds.push(peerId);
    this.roomModel.count++;

    this.sendStart();
  }

  onRoomPeerLeave(peerId) {
    console.log(`[server] peer ${peerId} is left`);
    const index = this.roomModel.peerIds.indexOf(peerId);
    if (index <= -1) {
      return;
    }

    this.roomModel.peerIds.splice(index, 1);
    this.roomModel.count--;
  }

  onRoomData({data, src}) {
    console.log(`[server] ${src}$ said ${JSON.stringify(data)}`);

    const {cmd} = data;
    switch (cmd) {
      case 'put':
        this.onReceivePut({data, src});
        break;
    }
  }

  onReceivePut({data, src}) {
    const {
      from: {
        x: fromX,
        level: fromLevel,
      },
      to: {
        x: toX,
        y: toY,
        level: toLevel,
      }
    } = data;

    this.roomGameController.put(src, fromX, fromLevel, toX, toY, toLevel);

    const positions = this.roomGameController.checkFinish();
    const turn = this.roomGameController.nextTurn();

    this.room.send({
      cmd: 'allow-put',
      peerId: src,
      from: {
        x: fromX,
        level: fromLevel,
      },
      to: {
        x: toX,
        y: toY,
        level: toLevel,
      },
      turn,
      positions,
    });
  }

  sendStart() {
    this.roomGameController.reset();

    this.room.send({
      cmd: 'start',
      peerIds: this.roomModel.peerIds,
      turn: this.roomModel.turn,
    });
  }

  sendUpdate() {

  }
}
