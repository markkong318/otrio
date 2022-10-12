import {Controller} from '../../framework/controller';
import {PeerDialogView} from '../view/dialog/peer-dialog-view';
import {PeerModel} from '../model/peer-model';
import bottle from '../../framework/bottle';

export class PeerDialogController extends Controller {
  private peerModel: PeerModel = bottle.inject(PeerModel);
  private peerDialogView: PeerDialogView = bottle.inject(PeerDialogView);

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
