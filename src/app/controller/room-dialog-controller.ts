import {Controller} from '../../framework/controller';
import {RoomDialogView} from '../view/dialog/room-dialog-view';


export class RoomDialogController extends Controller {
  private roomDialogView: RoomDialogView;

  setCount(count: number) {
    this.roomDialogView.setCount(count);
  }

  setRoomId(roomId: string) {
    const url = `${location.href}?roomId=${roomId}`;
    this.roomDialogView.setUrl(url);
  }

  show() {
    this.roomDialogView.visible = true;
  }

  hide() {
    this.roomDialogView.visible = false;
  }
}
