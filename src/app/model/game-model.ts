import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';
import {CELL_LEVEL_1, CELL_LEVEL_2, CELL_LEVEL_3} from '../env/cell';
import {PLAYER_1_ID, PLAYER_2_ID, PLAYER_3_ID, PLAYER_4_ID, PLAYER_NONE} from '../env/game';

export class GameModel extends Model {
  public player1: number[][];
  public player2: number[][];
  public player3: number[][];
  public player4: number[][];
  public battle: number[][][];

  public myId: number;

  constructor() {
    super();
    bottle.setObject(this);
  }

  reset() {
    this.player1 = [
      [PLAYER_1_ID, PLAYER_1_ID, PLAYER_1_ID],
      [PLAYER_1_ID, PLAYER_1_ID, PLAYER_1_ID],
      [PLAYER_1_ID, PLAYER_1_ID, PLAYER_1_ID],
    ];

    this.player1 = []
    this.player2 = []
    this.player3 = []
    this.player4 = []
    for (let i = 0; i < 3; i++) {
      this.player1[i] = [];
      this.player2[i] = [];
      this.player3[i] = [];
      this.player4[i] = [];
      for (let j = 0; j < 3; j++) {
        this.player1[i][j] = PLAYER_1_ID;
        this.player2[i][j] = PLAYER_2_ID;
        this.player3[i][j] = PLAYER_3_ID;
        this.player4[i][j] = PLAYER_4_ID;
      }
    }

    this.battle = [];
    for (let i = 0; i < 3; i++) {
      this.battle[i] = [];
      for (let j = 0; j < 3; j++) {
        this.battle[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.battle[i][j][k] = PLAYER_NONE;
        }
      }
    }

    // this.battle[0][1][0] = PLAYER_1_ID; // test
  }
}
