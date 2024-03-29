import {GameView} from './view/game-view';
import {PeerModel} from './model/peer-model';
import {BoardController} from './controller/board-controller';
import {Application} from '../framework/application';
import {Size} from '../framework/size';
import {Storage} from './storage/storage';
import bottle from '../framework/bottle';
import {CellTexture} from './texture/cell-texture';
import {RoomModel} from './model/room-model';
import {RoomController} from './controller/room-controller';
import {PeerController} from './controller/peer-controller';
import {RoomGameController} from './controller/room-game-controller';
import {PeerGameController} from './controller/peer-game-controller';
import {RoomDialogController} from './controller/room-dialog-controller';
import {MainController} from './controller/main-controller';
import {PeerDialogController} from './controller/peer-dialog-controller';
import {ErrorDialogController} from './controller/error-dialog-controller';

export class GameApplication extends Application {
  private peerModel: PeerModel;
  private roomModel: RoomModel;
  private mainController: MainController;
  private boardController: BoardController;
  private roomController: RoomController;
  private roomGameController: RoomGameController;
  private roomDialogController: RoomDialogController;
  private peerController: PeerController;
  private peerGameController: PeerGameController;
  private peerDialogController: PeerDialogController;
  private errorDialogController: ErrorDialogController;
  private gameView: GameView;
  private storage: Storage;
  private circleTexture: CellTexture;

  constructor(options?) {
    super(options);
    this.preload();
  }

  public preload(): void {
    this.loader
      .load((loader, resources) => {
        this.onAssetsLoaded();
      });
  }

  public onAssetsLoaded(): void {
    this.initScene();
  }

  public initScene(): void {
    bottle.setObject(this.renderer);

    this.peerModel = new PeerModel();
    this.roomModel = new RoomModel();
    this.peerModel = new PeerModel();

    this.storage = new Storage();
    this.storage.init();

    this.circleTexture = new CellTexture();
    this.circleTexture.init();

    const viewWidth = 480;
    const viewHeight = this.getViewHeight(viewWidth);

    this.gameView = new GameView();
    this.gameView.size = new Size(viewWidth, viewHeight);
    this.gameView.init();

    this.stage.addChild(this.gameView);

    this.resizeView();

    this.mainController = new MainController();
    this.mainController.init();

    this.boardController = new BoardController();
    this.boardController.init();

    this.roomController = new RoomController();
    this.roomController.init();

    this.roomGameController = new RoomGameController();
    this.roomGameController.init();

    this.roomDialogController = new RoomDialogController();
    this.roomDialogController.init();

    this.peerController = new PeerController();
    this.peerController.init();

    this.peerGameController = new PeerGameController();
    this.peerGameController.init();

    this.peerDialogController = new PeerDialogController();
    this.peerDialogController.init();

    this.errorDialogController = new ErrorDialogController();
    this.errorDialogController.init();

    this.mainController.start();
  }

  public getViewHeight(viewWidth) {
    if (this.renderer.width > this.renderer.height) {
      return 900;
    } else {
      return Math.floor(viewWidth * this.renderer.height / this.renderer.width);
    }
  }

  public resizeView(): void {
    if (this.renderer.width > this.renderer.height) {
      const scale = Math.min(this.renderer.width / this.gameView.size.width, this.renderer.height / this.gameView.size.height) / this.renderer.resolution;

      this.gameView.scale.x = scale;
      this.gameView.scale.y = scale;

      this.gameView.x = (this.renderer.width - this.gameView.size.width * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
      this.gameView.y = (this.renderer.height - this.gameView.size.height * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
    } else {
      const scale = this.renderer.width / this.gameView.size.width / this.renderer.resolution;

      this.gameView.scale.x = scale;
      this.gameView.scale.y = scale;

      this.gameView.x = 0;
      this.gameView.y = (this.renderer.height - this.gameView.size.height * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
    }
  }
}
