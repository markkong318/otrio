import {Controller} from '../../framework/controller';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {
  EVENT_PEER_START,
  EVENT_PEER_SEND_PUT,
} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS} from '../env/game';
import {PeerGameController} from './peer-game-controller';
import {BoardController} from './board-controller';

export class PeerController extends Controller {
  private peerModel: PeerModel;
  private peerGameController: PeerGameController;
  private boardController: BoardController;

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
    const {
      peerIds,
      nextIdx,
    } = data;

    const idx = peerIds.indexOf(this.peer.id);
    if (idx <= -1) {
      throw new Error('invalid peer idx');
    }

    this.peerModel.idx = idx;
    this.peerModel.nextIdx = nextIdx;
    this.peerModel.winnerIdx = undefined;
    this.peerModel.winnerPositions = [];
    this.peerModel.playerId = PLAYER_IDS[idx];
    this.peerModel.peerIds = peerIds;
    this.peerModel.count = peerIds.length;

    this.peerGameController.reset();

    this.boardController.renderTurn();
    this.boardController.renderBattleAndPlayers();
    this.boardController.renderWinner();
  }

  onReceivePutAllow({data, src}) {
    const {
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
      nextIdx,
      winnerIdx,
      winnerPositions,
    } = data;

    this.peerModel.nextIdx = nextIdx;
    this.peerModel.winnerIdx = winnerIdx;
    this.peerModel.winnerPositions = [...winnerPositions];

    this.peerGameController.put(nextIdx, fromX, fromLevel, toX, toY, toLevel);

    this.boardController.renderTurn();
    this.boardController.renderBattleAndPlayers();
    this.boardController.renderWinner();
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
