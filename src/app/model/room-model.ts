import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';

export class RoomModel extends Model {
  public playerCells: number[][][];
  public battleCells: number[][][];

  public count: number = 0;

  public peerIds: string[] = [];
  public turn: number;

  constructor() {
    super();
    bottle.setObject(this);
  }
}
