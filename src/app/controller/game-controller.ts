import {Controller} from '../../framework/controller';
import {GameModel} from '../model/game-model';
import bottle from '../../framework/bottle';
import {BoardView} from '../view/board-view';
import event from '../../framework/event';
import {EVENT_START_BATTLE, EVENT_UPDATE_BATTLE} from '../env/event';
import {EventUpdateBattleMsg} from '../env/msg';
import {PLAYER_4_ID, PLAYER_NONE} from '../env/game';

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

    event.on(EVENT_START_BATTLE, () => this.onEventStartBattle());
    event.on(EVENT_UPDATE_BATTLE, (msg) => this.onEventUpdateBattle(msg));
  }

  onEventStartBattle() {
    this.gameModel.reset(this.gameModel.count);
    this.boardView.renderPlayer1(this.gameModel.players[(this.gameModel.playerIdx + 1) % 4]);
    this.boardView.renderPlayer2(this.gameModel.players[(this.gameModel.playerIdx + 2) % 4]);
    this.boardView.renderPlayer3(this.gameModel.players[(this.gameModel.playerIdx + 3) % 4]);
    this.boardView.renderPlayer4(this.gameModel.players[this.gameModel.playerIdx]);
    this.boardView.renderBattle(this.gameModel.battle);
  }

  onEventUpdateBattle(msg: EventUpdateBattleMsg) {
    const {view, x, y} = msg;
    const level = view.getLevel();

    if (x == -1 || y == -1) {
      view.resetPosition();
      return;
    }

    const battle = this.gameModel.battle;
    if (battle[x][y][level] != PLAYER_NONE) {
      view.resetPosition();
      return;
    }

    battle[x][y][level] = this.gameModel.playerIdx;

    view.resetPosition();
    view.visible = false;

    this.boardView.renderBattle(battle);

    this.checkFinish();
  }

  checkFinish() {
    let positions;

    positions = this.checkFinishType1();
    if (positions.length) {
      console.log('type 1');
      return positions;
    }

    positions = this.checkFinishType2();
    if (positions.length) {
      console.log('type 2');
      return positions;
    }

    positions = this.checkFinishType3();
    if (positions.length) {
      console.log('type 3');
      return positions;
    }

    positions = this.checkFinishType4();
    if (positions.length) {
      console.log('type 4');
      return positions;
    }

    positions = this.checkFinishType5();
    if (positions.length) {
      console.log('type 5');
      return positions;
    }

    positions = this.checkFinishType6();
    if (positions.length) {
      console.log('type 6');
      return positions;
    }

    positions = this.checkFinishType7();
    if (positions.length) {
      console.log('type 7');
      return positions;
    }
  }

  checkFinishType1() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      for (let j = 0; j < battle[i].length; j++) {
        if (battle[i][j][0] != PLAYER_NONE &&
          battle[i][j][0] == battle[i][j][1] && battle[i][j][1] == battle[i][j][2]) {
          positions.push([i, j]);

          found = true;
        }

        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType2() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      for (let j = 0; j < battle[i][0].length; j++) {
        if (battle[i][0][j] != PLAYER_NONE &&
          battle[i][0][j] == battle[i][1][j] && battle[i][1][j] == battle[i][2][j]) {
          positions.push([i, 0]);
          positions.push([i, 1]);
          positions.push([i, 2]);

          found = true;
        }

        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType3() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle[0].length; i++) {
      for (let j = 0; j < battle[0][i].length; j++) {
        if (battle[0][i][j] != PLAYER_NONE &&
          battle[0][i][j] == battle[1][i][j] && battle[1][i][j] == battle[2][i][j]) {
          positions.push([0, i]);
          positions.push([1, i]);
          positions.push([2, i]);

          found = true;
        }
        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType4() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      if (battle[i][0][0] != PLAYER_NONE &&
        battle[i][0][0] == battle[i][1][1] && battle[i][1][1] == battle[i][2][2]) {
        positions.push([i, 0]);
        positions.push([i, 1]);
        positions.push([i, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[i][2][0] != PLAYER_NONE &&
        battle[i][2][0] == battle[i][1][1] && battle[i][1][1] == battle[i][0][2]) {
        positions.push([i, 0]);
        positions.push([i, 1]);
        positions.push([i, 2]);

        found = true;
      }

      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType5() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle[0].length; i++) {
      if (battle[0][i][0] != PLAYER_NONE &&
        battle[0][i][0] == battle[1][i][1] && battle[1][i][1] == battle[2][i][2]) {
        positions.push([0, i]);
        positions.push([1, i]);
        positions.push([2, i]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][i][0] != PLAYER_NONE &&
        battle[2][i][0] == battle[1][i][1] && battle[1][i][1] == battle[0][i][2]) {
        positions.push([0, i]);
        positions.push([1, i]);
        positions.push([2, i]);

        found = true;
      }

      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType6() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < 3; i++) {
      if (battle[0][0][i] != PLAYER_NONE &&
        battle[0][0][i] == battle[1][1][i] && battle[1][1][i] == battle[2][2][i]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][i] != PLAYER_NONE &&
        battle[2][0][i] == battle[1][1][i] && battle[1][1][i] == battle[0][2][i]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }
    }
    return positions;
  }

  checkFinishType7() {
    const battle = this.gameModel.battle;
    const positions = [];

    let found = false;
    for (let i = 0; i < 3; i++) {
      if (battle[0][0][0] != PLAYER_NONE &&
        battle[0][0][0] == battle[1][1][1] && battle[1][1][1] == battle[2][2][2]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[0][0][2] != PLAYER_NONE &&
        battle[0][0][2] == battle[1][1][1] && battle[1][1][1] == battle[2][2][0]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][0] &&
        battle[2][0][0] == battle[1][1][1] && battle[1][1][1] == battle[0][2][2]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][2] &&
        battle[2][0][2] == battle[1][1][1] && battle[1][1][1] == battle[0][2][0]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }

      if (found) {
        break;
      }
    }
    return positions;
  }
}
