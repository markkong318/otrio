import Peer, {MeshRoom} from 'skyway-js';
import {v4 as uuidv4} from 'uuid';

import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import {ServerModel} from '../model/server-model';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_SERVER_START} from '../env/event';
import {EventClientStartMsg} from '../env/msg';

export class ServerController extends Controller {
  private serverModel: ServerModel;

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
    bottle.setObject(this);
  }

  init() {
    this.serverModel = bottle.getObject(ServerModel);

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
      this.room.on('peerJoin', peerId => this.onRoomJoin(peerId));
      this.room.on('peerLeave', peerId => this.onRoomLeave(peerId));
      this.room.on('data', ({data, src}) => this.onRoomReceive({data, src}));
    });
  }

  onRoomOpen() {
    console.log(`[server] room ${this.room.name} is created`);
    event.emit(EVENT_CLIENT_START, new EventClientStartMsg(this.room.name));
  }

  onRoomJoin(peerId) {
    console.log(`[server] peer ${peerId} is joined`);
    this.serverModel.peerIds.push(peerId);
    this.serverModel.count++;

    this.sendStart();
  }

  onRoomLeave(peerId) {
    const index = this.serverModel.peerIds.indexOf(peerId);
    if (index <= -1) {
      return;
    }

    this.serverModel.peerIds.splice(index, 1);
    this.serverModel.count--;
  }

  onRoomReceive({data, src}) {
    console.log(`[server] ${src}$ said ${JSON.stringify(data)}`);

    const {cmd} = data;
    switch (cmd) {
      case 'start':
        this.onReceiveStart({data, src});
        break;
      case 'reset':
        this.onReceiveReset({data, src});
        break;
      case 'put':
        this.onReceivePut({data, src});
    }
  }

  onReceiveStart({data, src}) {
    if (src !== this.peer.id) {
      return;
    }
  }

  onReceiveReset({data, src}) {
    this.serverModel.reset();
  }

  onReceivePut({data, src}) {

  }

  sendStart() {
    this.room.send({
      cmd: 'start',
      players: this.serverModel.peerIds,
    });

    this.room.send("hello");
    this.room.send({a:1});
  }

  sendUpdate() {

  }
}
