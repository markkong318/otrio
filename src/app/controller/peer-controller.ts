import {Controller} from '../../framework/controller';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/sky-way';
import rocket from '../../framework/rocket';
import {EVENT_PEER_SEND_PUT, EVENT_PEER_START,} from '../env/event';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS} from '../env/game';
import {PeerGameController} from './peer-game-controller';
import {BoardController} from './board-controller';
import {ErrorDialogController} from './error-dialog-controller';
import {PeerDialogController} from './peer-dialog-controller';
import bottle from '../../framework/bottle';

export class PeerController extends Controller {
  private peerModel: PeerModel = bottle.inject(PeerModel);
  private peerGameController: PeerGameController = bottle.inject(PeerGameController);
  private peerDialogController: PeerDialogController = bottle.inject(PeerDialogController);
  private boardController: BoardController = bottle.inject(BoardController);
  private errorDialogController: ErrorDialogController = bottle.inject(ErrorDialogController);

  private peer: Peer;
  private room: MeshRoom;

  constructor() {
    super();
  }

  init() {
    rocket.on(EVENT_PEER_START, this.start, this);
    rocket.on(EVENT_PEER_SEND_PUT, this.sendPut, this)
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
      console.log('peer id:' + this.peer.id);

      this.room = this.peer.joinRoom(roomId, {
        mode: 'mesh',
      });

      this.room.on("open", () => this.onRoomOpen());
      this.room.on('peerLeave', peerId => this.onRoomPeerLeave(peerId));
      this.room.on('data', ({data, src}) => this.onReceive({data, src}));

      setTimeout(() => {
        if (this.peerModel.login) {
         return;
        }
        this.peerDialogController.setStatus('Timeout. This room may be closed');
      }, 5000)
    });
  }

  onRoomOpen() {
    console.log(`[peer] ${this.peer.id} joins room`);
    this.peerDialogController.setStatus('Waiting for game start...');
  }

  onRoomPeerLeave(peerId: string) {
    if (this.peerModel.start && this.peerModel.peerIds.indexOf(peerId) !== -1) {
      this.errorDialogController.setMessage('Player is left. Game over');
      this.errorDialogController.show();
    }
  }

  onReceive({data, src}) {
    console.log(`[peer] ${this.peer.id} to ${src} says ${JSON.stringify(data)}`);

    const {cmd, boardId} = data;

    if (cmd !== 'start' && boardId !== this.peerModel.boardId) {
      console.log(`[peer] board id check is failed. Actual: ${boardId}. Expect: ${this.peerModel.boardId}`);
      return;
    }

    switch (cmd) {
      case 'start':
        this.onReceiveStart({data, src});
        break;
      case 'allow-put':
        this.onReceivePutAllow({data, src});
        break;
      case 'kick':
        this.onReceiveKick({data, src});
        break;
      case 'hi':
        this.onReceiveHi({data, src});
        break;
    }
  }

  onReceiveStart({data, src}) {
    const {
      boardId,
      peerIds,
      nextIdx,
    } = data;

    const idx = peerIds.indexOf(this.peer.id);
    if (idx <= -1) {
      throw new Error('invalid peer idx');
    }

    this.peerModel.boardId = boardId;
    this.peerModel.start = true;
    this.peerModel.login = true;
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

  onReceiveHi({data, src}) {
    const {
      peerId,
    } = data;

    if (peerId !== this.peer.id) {
      return;
    }

    this.peerModel.login = true;
  }

  send(data) {
    data = {
      ...data,
      boardId: this.peerModel.boardId,
    }

    console.log(`[peer] ${this.peer.id} says ${JSON.stringify(data)}`);
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
