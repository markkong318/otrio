import Peer, {MeshRoom} from 'skyway-js';
import {v4 as uuidv4} from 'uuid';

import {Controller} from '../../framework/controller';
import {RoomModel} from '../model/room-model';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_PEER_START, EVENT_SERVER_SEND_START, EVENT_SERVER_START} from '../env/event';
import {RoomGameController} from './room-game-controller';
import {RoomDialogController} from './room-dialog-controller';

export class RoomController extends Controller {
  private roomModel: RoomModel;
  private roomGameController: RoomGameController;
  private roomDialogController: RoomDialogController;

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_SERVER_START, () => this.start());
    event.on(EVENT_SERVER_SEND_START, () => this.sendStart());
  }

  isAdmin() {
    return !!this.room;
  }

  start() {
    this.roomDialogController.show();
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
    event.emit(EVENT_PEER_START, {roomId: this.room.name, host: true});

    this.roomDialogController.setRoomId(this.room.name);
  }

  onRoomPeerJoin(peerId: string) {
    if (this.roomModel.count >= 4) {
      this.sendKick(peerId);
      return;
    }

    console.log(`[server] peer ${peerId} is joined`);
    this.roomModel.peerIds.push(peerId);
    this.roomModel.count++;

    if (this.roomModel.count > 0) {
      this.roomDialogController.showStart();
    } else {
      this.roomDialogController.hideStart()
    }

    this.roomDialogController.setCount(this.roomModel.count);
  }

  onRoomPeerLeave(peerId: string) {
    console.log(`[server] peer ${peerId} is left`);
    const index = this.roomModel.peerIds.indexOf(peerId);
    if (index <= -1) {
      return;
    }

    this.roomModel.peerIds.splice(index, 1);
    this.roomModel.count--;

    this.roomDialogController.setCount(this.roomModel.count);
  }

  onRoomData({data, src}) {
    console.log(`[server] ${src} > ${JSON.stringify(data)}`);

    const {cmd} = data;
    switch (cmd) {
      case 'put':
        this.onReceivePut({data, src});
        break;
    }
  }

  onReceivePut({data, src}) {
    const {
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
    } = data;

    this.roomGameController.put(src, fromX, fromLevel, toX, toY, toLevel);

    const winnerPositions = this.roomGameController.checkFinish();

    let winnerIdx;
    if (!!winnerPositions.length) {
      winnerIdx = this.roomModel.idx;
    }

    const idx = this.roomModel.idx;
    const nextIdx = this.roomGameController.nextTurn();

    this.room.send({
      cmd: 'allow-put',
      peerId: src,
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
      idx,
      nextIdx,
      winnerIdx,
      winnerPositions,
    });
  }

  sendStart() {
    this.roomGameController.reset();

    this.room.send({
      cmd: 'start',
      peerIds: this.roomModel.peerIds,
      nextIdx: this.roomModel.idx,
    });

    this.roomDialogController.hide();
  }

  sendKick(peerId: string) {
    this.room.send({
      cmd: 'kick',
      peerId,
    });
  }
}
