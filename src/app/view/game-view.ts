import * as PIXI from 'pixi.js';

import {View} from '../../framework/view';
import {Size} from '../../framework/size';
import {BoardView} from './board-view';
import {RoomDialogView} from './dialog/room-dialog-view';
import {PeerDialogView} from './dialog/peer-dialog-view';
import {ErrorDialogView} from './dialog/error-dialog-view';

export class GameView extends View {
  private background: PIXI.Sprite;
  private boardView: BoardView;
  private roomDialogView: RoomDialogView;
  private peerDialogView: PeerDialogView;
  private errorDialogView: ErrorDialogView;

  constructor() {
    super();
  }

  public init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xf9f1e1;
    this.addChild(this.background);

    this.boardView = new BoardView();
    this.boardView.init();
    this.boardView.x = 0;
    this.boardView.y = (this.height - this.boardView.height) / 2;
    this.addChild(this.boardView);

    this.roomDialogView = new RoomDialogView();
    this.roomDialogView.size = new Size(this.width, this.height);
    this.roomDialogView.init();
    this.addChild(this.roomDialogView);

    this.peerDialogView = new PeerDialogView();
    this.peerDialogView.size = new Size(this.width, this.height);
    this.peerDialogView.init();
    this.addChild(this.peerDialogView);

    this.errorDialogView = new ErrorDialogView();
    this.errorDialogView.size = new Size(this.width, this.height);
    this.errorDialogView.init();
    this.addChild(this.errorDialogView);
  }
}
