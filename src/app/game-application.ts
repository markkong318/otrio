import {GameView} from './view/game-view';
import {GameModel} from './model/game-model';
import {GameController} from './controller/game-controller';
import {Application} from '../framework/application';
import {Size} from '../framework/size';
import {Storage} from './storage/storage';
import bottle from '../framework/bottle';
import {CircleTexture} from './texture/circle-texture';
import {ServerModel} from './model/server-model';
import {ClientModel} from './model/client-model';
import {ServerController} from './controller/server-controller';
import {ClientController} from './controller/client-controller';
import event from '../framework/event';
import {EVENT_SERVER_START} from './env/event';
import {MasterController} from './controller/master-controller';

export class GameApplication extends Application {
  private gameModel: GameModel;
  private serverModel: ServerModel;
  private clientModel: ClientModel;
  private gameController: GameController;
  private serverController: ServerController;
  private serverGameController: MasterController;
  private clientController: ClientController;
  private gameView: GameView;
  private storage: Storage;
  private circleTexture: CircleTexture;

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

    this.gameModel = new GameModel();
    this.serverModel = new ServerModel();
    this.clientModel = new ClientModel();

    this.storage = new Storage();
    this.storage.init();

    this.circleTexture = new CircleTexture();
    this.circleTexture.init();

    const viewWidth = 480;
    const viewHeight = this.getViewHeight(viewWidth);

    this.gameView = new GameView();
    this.gameView.size = new Size(viewWidth, viewHeight);
    this.gameView.init();

    this.stage.addChild(this.gameView);

    this.resizeView();

    this.gameController = new GameController();
    this.gameController.init();

    this.serverController = new ServerController();
    this.serverController.init();

    this.serverGameController = new MasterController();
    this.serverGameController.init();

    this.clientController = new ClientController();
    this.clientController.init();

    event.emit(EVENT_SERVER_START);
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
