import {Controller} from '../../framework/controller';
import {GameModel} from '../model/game-model';
import bottle from '../../framework/bottle';
import {BoardView} from '../view/board-view';
import {CELL_COLOR_NONE, CELL_COLOR_PLAYER_1, CELL_COLOR_PLAYER_2, CELL_COLOR_PLAYER_3} from '../env/cell';

export class GameController extends Controller {
  private gameModel: GameModel;
  private boardView: BoardView;

  constructor() {
    super();
    bottle.setObject(this);
  }

  init() {
    this.gameModel = bottle.getObject(GameModel);
    this.boardView = bottle.getObject(BoardView);
  }

  start() {
    this.gameModel.reset();
    this.boardView.renderPlayer1(this.gameModel.player1);
    this.boardView.renderPlayer2(this.gameModel.player2);
    this.boardView.renderPlayer3(this.gameModel.player3);
    this.boardView.renderPlayer4(this.gameModel.player4);
    this.boardView.renderBattle(this.gameModel.battle);
  }

}
