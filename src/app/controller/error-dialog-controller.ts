import {Controller} from '../../framework/controller';
import {ErrorDialogView} from '../view/dialog/error-dialog-view';
import bottle from '../../framework/bottle';


export class ErrorDialogController extends Controller {
  private errorDialogView: ErrorDialogView = bottle.inject(ErrorDialogView);

  setMessage(msg: string) {
    this.errorDialogView.setMessage(msg);
  }

  show() {
    this.errorDialogView.visible = true;
  }

  hide() {
    this.errorDialogView.visible = false;
  }
}
