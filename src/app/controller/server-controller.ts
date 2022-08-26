import Peer, {MeshRoom} from 'skyway-js';
import {v4 as uuidv4} from 'uuid';

import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import {ServerModel} from '../model/server-model';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_SERVER_START} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {ServerGameController} from './server-game-controller';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';

export class ServerController extends Controller {
  private get serverModel(): ServerModel {return bottle.getObject(ServerModel);}
  private get serverGameController() : ServerGameController {return bottle.getObject(ServerGameController);}

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
    bottle.setObject(this);
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
    this.serverModel.peerIds.push(peerId);
    this.serverModel.count++;

    this.sendStart();
  }

  onRoomPeerLeave(peerId) {
    const index = this.serverModel.peerIds.indexOf(peerId);
    if (index <= -1) {
      return;
    }

    this.serverModel.peerIds.splice(index, 1);
    this.serverModel.count--;
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

    const idx = this.serverModel.peerIds.indexOf(src);
    const playerId = PLAYER_IDS[idx];

    if (this.serverModel.players[idx][fromX][fromLevel] !== playerId) {
      throw new Error('Not a valid source coordinate');
    }

    if (this.serverModel.battle[toX][toY][toLevel] !== PLAYER_NONE) {
      throw new Error('Not a valid target coordinate');
    }

    this.serverModel.players[idx][fromX][fromLevel] = PLAYER_NONE;
    this.serverModel.battle[toX][toY][toLevel] = playerId;

    const positions = this.serverGameController.checkFinish();

    // this.room.send({
    //   cmd: 'allow-put',
    //   playerId: src,
    //   from: {
    //     x: fromX,
    //     level: fromLevel,
    //   },
    //   to: {
    //     x: toX,
    //     y: toY,
    //     level: toLevel,
    //   },
    //   nextPlayerId: '',
    // });
  }

  sendStart() {
    this.serverGameController.reset();

    this.room.send({
      cmd: 'start',
      players: this.serverModel.peerIds,
    });
  }

  sendUpdate() {

  }
}
