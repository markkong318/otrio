import {Controller} from '../../framework/controller';
import {GameModel} from '../model/game-model';
import Bottle from '../../framework/bottle';

export class GameController extends Controller {
  private gameModel: GameModel;
  private intervalId;

  constructor() {
    super();

    this.gameModel = Bottle.get('gameModel');
  }

}
