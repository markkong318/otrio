import {Controller} from '../../framework/controller';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_PEER_START, EVENT_PEER_SEND_PUT, EVENT_START_BATTLE, EVENT_RENDER_BATTLE} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS} from '../env/game';
import {PeerGameController} from './peer-game-controller';

export class PeerController extends Controller {
  private peerModel: PeerModel;
  private peerGameController: PeerGameController;

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_PEER_START, this.startClient, this);
    event.on(EVENT_PEER_SEND_PUT, this.sendPut, this)
  }

  startClient(msg: EventClientStartMsg) {
    const {roomId} = msg;
    this.joinRoom(roomId);
  }

  joinRoom(roomId: string) {
    this.peer = new Peer({
      key: API_KEY,
      // debug: 3,
    });

    this.peer.on('open', () => {
      console.log('client peer id:' + this.peer.id);

      this.room = this.peer.joinRoom(roomId, {
        mode: 'mesh',
      });

      this.room.on("open", () => this.onRoomOpen());
      // this.room.on('peerJoin', peerId => this.onJoin(peerId));
      // this.room.on('peerLeave', peerId => this.onLeave(peerId));
      this.room.on('data', ({data, src}) => this.onReceive({data, src}));
    });
  }

  onRoomOpen() {
    console.log(`[client] ${this.peer.id} > join room`);
  }

  onReceive({data, src}) {
    console.log(`[client] ${this.peer.id} > ${src}$ said ${JSON.stringify(data)}`);

    const {cmd} = data;
    switch (cmd) {
      case 'start':
        this.onReceiveStart({data, src});
        break;
      case 'allow-put':
        this.onReceivePutAllow({data, src});
        break;
    }
  }

  onReceiveStart({data, src}) {
    const {peerIds} = data;

    const idx = peerIds.indexOf(this.peer.id);
    if (idx <= -1) {
      throw new Error('invalid client player id');
    }

    console.log(`idx: ${idx}`);
    console.log(`count: ${peerIds.length}`);

    this.peerModel.idx = idx;
    this.peerModel.playerId = PLAYER_IDS[idx];
    this.peerModel.peerIds = peerIds;
    this.peerModel.count = peerIds.length;

    this.peerGameController.reset();

    event.emit(EVENT_START_BATTLE);
  }

  onReceivePutAllow({data, src}) {
    const {
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
      turn,
      positions,
    } = data;

    this.peerGameController.put(turn, fromX, fromLevel, toX, toY, toLevel);

    event.emit(EVENT_RENDER_BATTLE);
  }

  send(data) {
    console.log(`[client] ${this.peer.id} > ${JSON.stringify(data)}`);
    this.room.send(data);
  }

  sendPut({fromX, fromLevel, toX, toY, toLevel}: {fromX: number, fromLevel: number, toX: number, toY: number, toLevel: number}) {
    this.send({
      cmd: 'put',
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
    });
  }
}
