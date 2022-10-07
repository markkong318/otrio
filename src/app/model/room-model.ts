import {Model} from '../../framework/model';

export class RoomModel extends Model {
  public playerCells: number[][][];
  public battleCells: number[][][];

  public boardId: string;

  public count: number = 0;

  public peerIds: string[] = [];
  public idx: number = 0;

  constructor() {
    super();
  }
}
