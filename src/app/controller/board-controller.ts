import {Controller} from '../../framework/controller';
import {PeerModel} from '../model/peer-model';
import {BoardView} from '../view/game/board-view';
import event from '../../framework/event';
import {EVENT_PEER_SEND_PUT, EVENT_RENDER_BATTLE_AND_PLAYERS, EVENT_CELL_VIEW_PUT} from '../env/event';
import {PLAYER_NONE} from '../env/game';
import {CELL_COLOR_NONE, CELL_COLOR_PLAYERS} from '../env/cell';
import {CellView} from '../view/game/board/cell-view';
import {MessageView} from '../view/game/board/message-view';

export class BoardController extends Controller {
  private peerModel: PeerModel;
  private boardView: BoardView;
  private messageView: MessageView;

  constructor() {
    super();
  }

  init() {
    event.on(EVENT_RENDER_BATTLE_AND_PLAYERS, this.renderBattleAndPlayers, this);
    event.on(EVENT_CELL_VIEW_PUT, this.onCellViewPut, this);
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

  renderTurn() {
    console.log()
    if (this.peerModel.nextIdx == this.peerModel.idx) {
      this.messageView.setText('Your turn!');
      this.boardView.setMaskVisible(false);
    } else {
      this.messageView.setText('Wait other player');
      this.boardView.setMaskVisible(true);
    }
  }

  renderWinner() {
    if (this.peerModel.winnerIdx == undefined) {
      this.boardView.renderWinnerPosition([]);
      return;
    }

    if (this.peerModel.winnerIdx == this.peerModel.idx) {
      this.messageView.setText('You win!');
    } else {
      this.messageView.setText('You lose!');
    }

    this.boardView.setMaskVisible(true);

    this.boardView.renderWinnerPosition(this.peerModel.winnerPositions);
  }

  renderControl() {
    const host = this.peerModel.host;
    this.boardView.setControlVisible(host);
  }

  onCellViewPut({view, x, y}: {view: CellView, x: number, y: number}) {
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

    event.emit(EVENT_PEER_SEND_PUT, {
      fromX: view.getIdx(),
      fromLevel: view.getLevel(),
      toX: x,
      toY: y,
      toLevel: level,
    });
  }
}
