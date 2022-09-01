import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import Peer, {MeshRoom} from 'skyway-js';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_START_BATTLE} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';

export class PeerGameController extends Controller {
  private peerModel: PeerModel;

  constructor() {
    super();
  }

  put(peerId, fromX, fromLevel, toX, toY, toLevel) {
    const idx = this.peerModel.peerIds.indexOf(peerId);

    const playerId = PLAYER_IDS[idx];

    if (this.peerModel.playerCells[idx][fromX][fromLevel] !== playerId) {
      throw new Error('Not a valid source coordinate');
    }

    if (this.peerModel.battleCells[toX][toY][toLevel] !== PLAYER_NONE) {
      throw new Error('Not a valid target coordinate');
    }

    this.peerModel.playerCells[idx][fromX][fromLevel] = PLAYER_NONE;
    this.peerModel.battleCells[toX][toY][toLevel] = playerId;
  }

  reset() {
    this.peerModel.playerCells = [];
    for (let i = 0; i < 4; i++) {
      this.peerModel.playerCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.peerModel.playerCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.peerModel.playerCells[i][j][k] = i < this.peerModel.count ? PLAYER_IDS[i] : PLAYER_NONE;
        }
      }
    }

    this.peerModel.battleCells = [];
    for (let i = 0; i < 3; i++) {
      this.peerModel.battleCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.peerModel.battleCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.peerModel.battleCells[i][j][k] = PLAYER_NONE;
        }
      }
    }
  }
}
