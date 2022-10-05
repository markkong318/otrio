import {Controller} from '../../framework/controller';
import queryString from '../storage/query-string';
import event from '../../framework/event';
import {EVENT_PEER_START, EVENT_SERVER_START} from '../env/event';

export class MainController extends Controller {
  start() {
    const {roomId} = queryString;
    if (roomId) {
      event.emit(EVENT_PEER_START, { roomId });
      return;
    }
    event.emit(EVENT_SERVER_START);
  }
}
