import {View} from '../../framework/view';
import bottle from '../../framework/bottle';
import {CellView} from './cell-view';
import {Size} from '../../framework/size';
import {
  CELL_COLOR_EMPTY,
  CELL_COLOR_NONE,
  CELL_COLOR_PLAYER_1, CELL_COLOR_PLAYER_2, CELL_COLOR_PLAYER_3, CELL_COLOR_PLAYER_4, CELL_COLOR_PLAYERS,
  CELL_LEVEL_1,
  CELL_LEVEL_2,
  CELL_LEVEL_3
} from '../env/cell';
import {PLAYER_1_ID, PLAYER_2_ID, PLAYER_3_ID, PLAYER_4_ID, PLAYER_NONE} from '../env/game';
import event from '../../framework/event';
import {EVENT_CELL_MOVE, EVENT_CELL_OUT, EVENT_UPDATE_BATTLE} from '../env/event';
import {EventCellMoveMsg, EventCellOutMsg, EventUpdateBattleMsg} from '../env/msg';

export class BoardView extends View {
  private battleCellViews: CellView[][];

  private player1CellViews: CellView[];
  private player2CellViews: CellView[];
  private player3CellViews: CellView[];
  private player4CellViews: CellView[][];

  private selectedX: number = -1;
  private selectedY: number = -1;

  constructor() {
    super();
    bottle.setObject(this);
  }

  public init() {
    this.initBattle();
    this.initPlayerLeft();
    this.initPlayerUp();
    this.initPlayerRight();
    this.initPlayerDown();

    event.on(EVENT_CELL_MOVE, (msg) => this.onBattlePointerMove(msg));
    event.on(EVENT_CELL_OUT, (msg) => this.onBattlePointerOut(msg));
  }

  initBattle() {
    this.battleCellViews = []
    for (let i = 0; i < 3; i++) {
      this.battleCellViews[i] = [];
      for (let j = 0; j < 3; j++) {
        const cell = new CellView();
        cell.size = new Size(96, 96);
        cell.x = 96 + 96 * j;
        cell.y = 96 + 96 * i;
        cell.init();

        this.addChild(cell);

        this.battleCellViews[i][j] = cell;
      }
    }
  }

  initPlayerLeft() {
    this.player1CellViews = [];
    for (let i = 0; i < 3; i++) {
      const cell = new CellView();
      cell.size = new Size(96, 96);
      cell.x = 0;
      cell.y = 96 + 96 * i;
      cell.init();

      this.addChild(cell);

      this.player1CellViews[i] = cell;
    }
  }

  initPlayerUp() {
    this.player2CellViews = [];
    for (let i = 0; i < 3; i++) {
      const cell = new CellView();
      cell.size = new Size(96, 96);
      cell.x = 96 + 96 * i;
      cell.y = 0;
      cell.init();

      this.addChild(cell);

      this.player2CellViews[i] = cell;
    }
  }

  initPlayerRight() {
    this.player3CellViews = [];
    for (let i = 0; i < 3; i++) {
      const cell = new CellView();
      cell.size = new Size(96, 96);
      cell.x = 96 * 4;
      cell.y = 96 + 96 * i;
      cell.init();

      this.addChild(cell);

      this.player3CellViews[i] = cell;
    }
  }

  initPlayerDown() {
    this.player4CellViews = []
    for (let i = 0; i < 3; i++) {
      this.player4CellViews[i] = []
      for (let j = 0; j < 3; j++) {
        const cell = new CellView();
        cell.size = new Size(96, 96);
        cell.x = 96 + 96 * i;
        cell.y = 96 * 4 + 96 * j;
        cell.init();

        cell.setMovable(true);

        this.addChild(cell);

        this.player4CellViews[i][j] = cell;
      }
    }
  }

  renderPlayerLeft(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.player1CellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerUp(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.player2CellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerRight(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.player3CellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerDown(cells: number[][], color: number) {
    for (let i = 0; i < this.player4CellViews.length; i++) {
      for (let j = 0; j < this.player4CellViews[i].length; j++) {
        this.player4CellViews[i][j].setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
        this.player4CellViews[i][j].setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
        this.player4CellViews[i][j].setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.player4CellViews[i];

      cell[CELL_LEVEL_1] ? view[0].setColor(CELL_LEVEL_1, color) : view[0].setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view[1].setColor(CELL_LEVEL_2, color) : view[1].setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view[2].setColor(CELL_LEVEL_3, color) : view[2].setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderBattle(cells) {
    console.log('battle:')
    console.log(cells);
    for (let i = 0; i < this.battleCellViews.length; i++) {
      for (let j = 0; j < this.battleCellViews[i].length; j++) {
        this.battleCellViews[i][j].setColor(CELL_LEVEL_1, CELL_COLOR_EMPTY);
        this.battleCellViews[i][j].setColor(CELL_LEVEL_2, CELL_COLOR_EMPTY);
        this.battleCellViews[i][j].setColor(CELL_LEVEL_3, CELL_COLOR_EMPTY);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        for (let k = 0; k < cells[i][j].length; k++) {
          switch (true) {
            case cells[i][j][k] === PLAYER_1_ID:
              this.battleCellViews[i][j].setColor(k, CELL_COLOR_PLAYER_1);
              break;
            case cells[i][j][k] === PLAYER_2_ID:
              this.battleCellViews[i][j].setColor(k, CELL_COLOR_PLAYER_2);
              break;
            case cells[i][j][k] === PLAYER_3_ID:
              this.battleCellViews[i][j].setColor(k, CELL_COLOR_PLAYER_3);
              break;
            case cells[i][j][k] === PLAYER_4_ID:
              this.battleCellViews[i][j].setColor(k, CELL_COLOR_PLAYER_4);
              break;
            case cells[i][j][k] === PLAYER_NONE:
              this.battleCellViews[i][j].setColor(k, CELL_COLOR_EMPTY);
              break;
          }
        }
      }
    }
  }

  drawPlayerLeft(x: number, level: number, color: number) {
    const view = this.player1CellViews[x];
    view.setColor(level, color);
  }

  drawPlayerUp(x: number, level: number, color: number) {
    const view = this.player2CellViews[x];
    view.setColor(level, color);
  }

  drawPlayerRight(x: number, level: number, color: number) {
    const view = this.player3CellViews[x];
    view.setColor(level, color);
  }

  drawPlayerDown(x: number, level: number, color: number) {
    const view = this.player4CellViews[x][level];
    view.setColor(level, color);
  }

  drawBattleCell(x: number, y: number, level: number, color: number) {
    const view = this.battleCellViews[x][y];
    view.setColor(level, color);
  }

  getBattlePosition(view: CellView) {
    const x = view.x + view.width / 2;
    const y = view.y + view.height / 2;

    for (let i = 0; i < this.battleCellViews.length; i++) {
      for (let j = 0; j < this.battleCellViews[i].length; j++) {
        const cellView = this.battleCellViews[i][j];
        if (cellView.x < x && (cellView.x + cellView.width) > x &&
          cellView.y < y && (cellView.y + cellView.height) > y) {
          return [i, j]
        }
      }
    }

    return [-1, -1];
  }

  onBattlePointerMove(msg: EventCellMoveMsg) {
    const {view} = msg;
    const [selectedX, selectedY] = this.getBattlePosition(view);

    if (this.selectedX == selectedX && this.selectedY == selectedY) {
      return;
    }

    this.selectedX = selectedX;
    this.selectedY = selectedY;

    for (let i = 0; i < this.battleCellViews.length; i++) {
      for (let j = 0; j < this.battleCellViews[i].length; j++) {
        this.battleCellViews[i][j].setSelected(i == selectedX && j == selectedY);
      }
    }
  }

  onBattlePointerOut(msg: EventCellMoveMsg) {
    this.onBattlePointerMove(msg);

    const {view} = msg;
    event.emit(EVENT_UPDATE_BATTLE, new EventUpdateBattleMsg(view, this.selectedX, this.selectedY));
  }
}
