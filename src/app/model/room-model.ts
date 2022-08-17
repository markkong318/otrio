import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';

export class GameModel extends Model {
  public roomId: number;

  constructor() {
    super();
    bottle.setObject(this);
  }

  create() {

  }
}
