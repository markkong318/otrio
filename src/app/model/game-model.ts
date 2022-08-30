import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';

export class GameModel extends Model {
  public playerCells: number[][][];
  public battleCells: number[][][];

  public playerIdx: number = 0;
  public count: number = 0;

  constructor() {
    super();
    bottle.setObject(this);
  }

  reset() {
    this.playerCells = [];
    for (let i = 0; i < 4; i++) {
      this.playerCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.playerCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.playerCells[i][j][k] = i < this.count ? PLAYER_IDS[i] : PLAYER_NONE;
        }
      }
    }

    this.battleCells = [];
    for (let i = 0; i < 3; i++) {
      this.battleCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.battleCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.battleCells[i][j][k] = PLAYER_NONE;
        }
      }
    }
  }
}
