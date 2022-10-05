import {Controller} from '../../framework/controller';
import {ErrorDialogView} from '../view/dialog/error-dialog-view';


export class ErrorDialogController extends Controller {
  private errorDialogView: ErrorDialogView;

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
