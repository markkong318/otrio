import {Controller} from '../../framework/controller';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {
  EVENT_PEER_START,
  EVENT_PEER_SEND_PUT,
} from '../env/event';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS} from '../env/game';
import {PeerGameController} from './peer-game-controller';
import {BoardController} from './board-controller';
import {ErrorDialogController} from './error-dialog-controller';
import {PeerDialogController} from './peer-dialog-controller';

export class PeerController extends Controller {
  private peerModel: PeerModel;
  private peerGameController: PeerGameController;
  private peerDialogController: PeerDialogController;
  private boardController: BoardController;
  private errorDialogController: ErrorDialogController;

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_PEER_START, this.start, this);
    event.on(EVENT_PEER_SEND_PUT, this.sendPut, this)
  }

  start({roomId, host}: { roomId: string, host: boolean }) {
    this.peerModel.host = host;

    this.peerDialogController.setStatus('Connecting to room...');
    this.peerDialogController.show();
    this.joinRoom(roomId);

    this.boardController.renderControl();
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
      this.room.on('peerLeave', peerId => this.onRoomPeerLeave(peerId));
      this.room.on('data', ({data, src}) => this.onReceive({data, src}));
    });
  }

  onRoomOpen() {
    console.log(`[client] ${this.peer.id} > join room`);
    this.peerDialogController.setStatus('Waiting for game start...');
  }

  onRoomPeerLeave(peerId: string) {
    if (this.peerModel.start && this.peerModel.peerIds.indexOf(peerId) !== -1) {
      this.errorDialogController.setMessage('Player is left. Game over');
      this.errorDialogController.show();
    }
  }

  onReceive({data, src}) {
    console.log(`[client] ${this.peer.id} > ${src} > ${JSON.stringify(data)}`);

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

    this.peerModel.start = true;
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

    this.peerDialogController.hide();
  }

  onReceivePutAllow({data, src}) {
    const {
      fromX,
      fromLevel,
      toX,
      toY,
      toLevel,
      idx,
      nextIdx,
      winnerIdx,
      winnerPositions,
    } = data;

    this.peerModel.nextIdx = nextIdx;
    this.peerModel.winnerIdx = winnerIdx;
    this.peerModel.winnerPositions = [...winnerPositions];

    this.peerGameController.put(idx, fromX, fromLevel, toX, toY, toLevel);

    this.boardController.renderTurn();
    this.boardController.renderBattleAndPlayers();
    this.boardController.renderWinner();
  }

  onReceiveKick({data, src}) {
    const {
      peerId,
    } = data;

    if (peerId !== this.peer.id) {
      return;
    }

    this.errorDialogController.setMessage('This room is full');
    this.errorDialogController.show();
  }

  send(data) {
    console.log(`[client] ${this.peer.id} > ${JSON.stringify(data)}`);
    this.room.send(data);
  }

  sendPut({fromX, fromLevel, toX, toY, toLevel}: { fromX: number, fromLevel: number, toX: number, toY: number, toLevel: number }) {
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
