import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';

export class RoomController extends Controller {

  constructor() {
    super();
    bottle.setObject(this);
  }
}
