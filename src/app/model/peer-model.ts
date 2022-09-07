import {Model} from '../../framework/model';

export class PeerModel extends Model {
  public playerCells: number[][][];
  public battleCells: number[][][];

  public idx: number = -1
  public playerId: number = 0;
  public count: number = -1;

  public peerIds: string[] = [];

  constructor() {
    super();
  }

}
