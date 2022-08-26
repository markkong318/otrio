import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';

export class ServerModel extends Model {
  public players: number[][][];
  public battle: number[][][];

  public count: number = 0;

  public peerIds: string[] = [];
  public nextPeerId: string;

  constructor() {
    super();
    bottle.setObject(this);
  }

  // reset() {
  //   this.players = [];
  //   for (let i = 0; i < 4; i++) {
  //     this.players[i] = [];
  //     for (let j = 0; j < 3; j++) {
  //       this.players[i][j] = [];
  //       for (let k = 0; k < 3; k++) {
  //         this.players[i][j][k] = i < this.count ? PLAYER_IDS[i] : PLAYER_NONE;
  //       }
  //     }
  //   }
  //
  //   this.battle = [];
  //   for (let i = 0; i < 3; i++) {
  //     this.battle[i] = [];
  //     for (let j = 0; j < 3; j++) {
  //       this.battle[i][j] = [];
  //       for (let k = 0; k < 3; k++) {
  //         this.battle[i][j][k] = PLAYER_NONE;
  //       }
  //     }
  //   }
  // }
}
