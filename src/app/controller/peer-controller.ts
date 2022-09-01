import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_START_BATTLE} from '../env/event';
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
    event.on(EVENT_CLIENT_START, (msg) => this.startClient(msg));
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
    console.log(`[client#${this.peer.id}] join room`);
  }

  onReceive({data, src}) {
    console.log(`[client#${this.peer.id}] ${src}$ said ${JSON.stringify(data)}`);

    const {cmd} = data;
    switch (cmd) {
      case 'start':
        this.onReceiveStart({data, src});
        break;
      case 'put-allow':
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
      cmd,
      peerId,
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
    } = data;
  }
}
