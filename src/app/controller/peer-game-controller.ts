import {Controller} from '../../framework/controller';
import {PeerModel} from '../model/peer-model';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';
import bottle from '../../framework/bottle';

export class PeerGameController extends Controller {
  private peerModel: PeerModel = bottle.inject(PeerModel);

  constructor() {
    super();
  }

  put(idx, fromX, fromLevel, toX, toY, toLevel) {
    const playerId = PLAYER_IDS[idx];

    if (this.peerModel.playerCells[idx][fromX][fromLevel] !== playerId) {
      throw new Error('Not a valid source coordinate');
    }

    if (this.peerModel.battleCells[toX][toY][toLevel] !== PLAYER_NONE) {
      throw new Error('Not a valid target coordinate');
    }

    this.peerModel.playerCells[idx][fromX][fromLevel] = PLAYER_NONE;
    this.peerModel.battleCells[toX][toY][toLevel] = playerId;

    console.log("peer battle cell:");
    console.log(this.peerModel.battleCells);
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
