import {Controller} from '../../framework/controller';
import {PeerModel} from '../model/peer-model';
import bottle from '../../framework/bottle';
import {BoardView} from '../view/board-view';
import event from '../../framework/event';
import {EVENT_START_BATTLE, EVENT_UPDATE_BATTLE} from '../env/event';
import {EventUpdateBattleMsg} from '../env/msg';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';
import {CELL_COLOR_EMPTY, CELL_COLOR_NONE, CELL_COLOR_PLAYERS} from '../env/cell';

export class BoardController extends Controller {
  private peerModel: PeerModel;
  private boardView: BoardView;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_START_BATTLE, () => this.renderBattleAndPlayers());
    event.on(EVENT_UPDATE_BATTLE, (msg) => this.onEventUpdateBattle(msg));
  }

  renderPlayer({peerId}) {
    const idx = this.peerModel.idx;
    const targetIdx = this.peerModel.peerIds.indexOf(peerId);
    if (targetIdx == this.peerModel.idx) {
      this.boardView.renderPlayerDown(this.peerModel.playerCells[targetIdx], CELL_COLOR_PLAYERS[targetIdx]);
    } else if((idx + 1) % 4 == targetIdx) {
      this.boardView.renderPlayerLeft(this.peerModel.playerCells[targetIdx], CELL_COLOR_PLAYERS[targetIdx]);
    } else if((idx + 2) % 4 == targetIdx) {
      this.boardView.renderPlayerUp(this.peerModel.playerCells[targetIdx], CELL_COLOR_PLAYERS[targetIdx]);
    } else if((idx + 3) % 4 == targetIdx) {
      this.boardView.renderPlayerRight(this.peerModel.playerCells[targetIdx], CELL_COLOR_PLAYERS[targetIdx]);
    }
  }

  renderBattle() {
    this.boardView.renderBattle(this.peerModel.battleCells);
  }

  renderBattleAndPlayers() {
    const idx = this.peerModel.idx;
    this.boardView.renderPlayerLeft(this.peerModel.playerCells[(idx + 1) % 4], CELL_COLOR_PLAYERS[(idx + 1) % 4]);
    this.boardView.renderPlayerUp(this.peerModel.playerCells[(idx + 2) % 4], CELL_COLOR_PLAYERS[(idx + 2) % 4]);
    this.boardView.renderPlayerRight(this.peerModel.playerCells[(idx + 3) % 4], CELL_COLOR_PLAYERS[(idx + 3) % 4]);
    this.boardView.renderPlayerDown(this.peerModel.playerCells[idx], CELL_COLOR_PLAYERS[idx]);
    this.boardView.renderBattle(this.peerModel.battleCells);
  }

  onEventUpdateBattle(msg: EventUpdateBattleMsg) {
    console.log('onEventUpdateBattle')
    const {view, x, y} = msg;
    const level = view.getLevel();

    if (x == -1 || y == -1) {
      view.resetPosition();
      return;
    }

    if (this.peerModel.battleCells[x][y][level] != PLAYER_NONE) {
      view.resetPosition();
      return;
    }

    this.boardView.drawBattleCell(x, y, level, CELL_COLOR_PLAYERS[this.peerModel.idx]);

    view.resetPosition();
    view.setMovable(false);
    view.setColor(level, CELL_COLOR_NONE);
  }
}
