import {Model} from '../../framework/model';
import bottle from '../../framework/bottle';
import Peer from 'skyway-js';

export class ClientModel extends Model {
  public player_uid: string;

  constructor() {
    super();
    bottle.setObject(this);
  }

  create() {

  }
}
