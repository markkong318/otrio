import {Controller} from '../../framework/controller';
import {PeerDialogView} from '../view/dialog/peer-dialog-view';
import {PeerModel} from '../model/peer-model';

export class PeerDialogController extends Controller {
  private peerModel: PeerModel;
  private peerDialogView: PeerDialogView;

  setStatus(msg: string) {
    this.peerDialogView.setStatus(msg);
  }

  show() {
    if (this.peerModel.host) {
      return;
    }
    this.peerDialogView.visible = true;
  }

  hide() {
    if (this.peerModel.host) {
      return;
    }
    this.peerDialogView.visible = false;
  }
}
