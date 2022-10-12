import {Controller} from '../../framework/controller';
import {RoomDialogView} from '../view/dialog/room-dialog-view';
import bottle from '../../framework/bottle';


export class RoomDialogController extends Controller {
  private roomDialogView: RoomDialogView = bottle.inject(RoomDialogView);

  setCount(count: number) {
    this.roomDialogView.setCount(count);
  }

  setRoomId(roomId: string) {
    const url = `${location.href}?roomId=${roomId}`;
    this.roomDialogView.setUrl(url);
  }

  showStart() {
    this.roomDialogView.setStartVisible(true);
  }

  hideStart() {
    this.roomDialogView.setStartVisible(false);
  }

  show() {
    this.roomDialogView.visible = true;
  }

  hide() {
    this.roomDialogView.visible = false;
  }
}
