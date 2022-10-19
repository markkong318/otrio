import {Controller} from '../../framework/controller';
import queryString from '../storage/query-string';
import rocket from '../../framework/rocket';
import {EVENT_PEER_START, EVENT_ROOM_START} from '../env/event';

export class MainController extends Controller {
  start() {
    const {roomId} = queryString;
    if (roomId) {
      rocket.emit(EVENT_PEER_START, { roomId });
      return;
    }
    rocket.emit(EVENT_ROOM_START);
  }
}
