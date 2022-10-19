import * as PIXI from 'pixi.js';

import {View} from '../../../framework/view';
import {CellView} from './board/cell-view';
import {Size} from '../../../framework/size';
import {
  CELL_COLOR_EMPTY,
  CELL_COLOR_NONE,
  CELL_COLOR_PLAYER_1,
  CELL_COLOR_PLAYER_2,
  CELL_COLOR_PLAYER_3,
  CELL_COLOR_PLAYER_4,
  CELL_LEVEL_1,
  CELL_LEVEL_2,
  CELL_LEVEL_3
} from '../../env/cell';
import {PLAYER_1_ID, PLAYER_2_ID, PLAYER_3_ID, PLAYER_4_ID, PLAYER_NONE} from '../../env/game';
import rocket from '../../../framework/rocket';
import {EVENT_CELL_VIEW_MOVE, EVENT_CELL_VIEW_OUT, EVENT_CELL_VIEW_PUT} from '../../env/event';
import {MessageView} from './board/message-view';
import {ControlView} from './board/control-view';

export class BoardView extends View {
  private battleCellViews: CellView[][];

  private playerLeftCellViews: CellView[];
  private playerUpCellViews: CellView[];
  private playerRightCellViews: CellView[];
  private playerDownCellViews: CellView[][];
  private messageView: MessageView;
  private controlView: ControlView;
  private maskView: PIXI.Sprite;

  private selectedX: number = -1;
  private selectedY: number = -1;

  public init() {
    this.sortableChildren = true;

    this.initBattle();
    this.initPlayerLeft();
    this.initPlayerUp();
    this.initPlayerRight();
    this.initPlayerDown();
    this.initMessageView();
    this.initControlView();
    this.initMaskView();

    rocket.on(EVENT_CELL_VIEW_MOVE, this.onCellViewMove, this);
    rocket.on(EVENT_CELL_VIEW_OUT, this.onCellViewOut, this);
  }

  initBattle() {
    this.battleCellViews = []
    for (let i = 0; i < 3; i++) {
      this.battleCellViews[i] = [];
      for (let j = 0; j < 3; j++) {
        const view = new CellView();
        view.size = new Size(96, 96);
        view.x = 96 + 96 * j;
        view.y = 96 + 96 * i;
        view.init();

        this.addChild(view);

        this.battleCellViews[i][j] = view;
      }
    }
  }

  initPlayerLeft() {
    this.playerLeftCellViews = [];
    for (let i = 0; i < 3; i++) {
      const view = new CellView();
      view.size = new Size(96, 96);
      view.x = 0;
      view.y = 96 + 96 * i;
      view.init();

      this.addChild(view);

      this.playerLeftCellViews[i] = view;
    }
  }

  initPlayerUp() {
    this.playerUpCellViews = [];
    for (let i = 0; i < 3; i++) {
      const view = new CellView();
      view.size = new Size(96, 96);
      view.x = 96 + 96 * i;
      view.y = 0;
      view.init();

      this.addChild(view);

      this.playerUpCellViews[i] = view;
    }
  }

  initPlayerRight() {
    this.playerRightCellViews = [];
    for (let i = 0; i < 3; i++) {
      const view = new CellView();
      view.size = new Size(96, 96);
      view.x = 96 * 4;
      view.y = 96 + 96 * i;
      view.init();

      this.addChild(view);

      this.playerRightCellViews[i] = view;
    }
  }

  initPlayerDown() {
    this.playerDownCellViews = []
    for (let i = 0; i < 3; i++) {
      this.playerDownCellViews[i] = []
      for (let j = 0; j < 3; j++) {
        const view = new CellView();
        view.size = new Size(96, 96);
        view.x = 96 + 96 * i;
        view.y = 96 * 4 + 96 * j;
        view.init();

        view.setLevel(j);
        view.setIdx(i)

        this.addChild(view);

        this.playerDownCellViews[i][j] = view;
      }
    }
  }

  initMessageView() {
    this.messageView = new MessageView();
    this.messageView.size = new Size(this.width, 40);
    this.messageView.y = this.playerDownCellViews[0][2].y + this.playerDownCellViews[0][2].height;
    this.messageView.init();
    this.addChild(this.messageView);
  }

  initControlView() {
    this.controlView = new ControlView();
    this.controlView.size = new Size(this.width, 40);
    this.controlView.y = this.messageView.y + this.messageView.height;
    this.controlView.init();
    this.addChild(this.controlView);
  }

  initMaskView() {
    this.maskView = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.maskView.width = 96 * 3;
    this.maskView.height = 96 * 3;
    this.maskView.x = this.playerDownCellViews[0][0].x;
    this.maskView.y = this.playerDownCellViews[0][0].y;
    this.maskView.interactive = true;
    this.maskView.zIndex = 2;
    this.addChild(this.maskView);
  }

  renderPlayerLeft(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.playerLeftCellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerUp(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.playerUpCellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerRight(cells: number[][], color: number) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.playerRightCellViews[i];

      cell[CELL_LEVEL_1] ? view.setColor(CELL_LEVEL_1, color) : view.setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ? view.setColor(CELL_LEVEL_2, color) : view.setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ? view.setColor(CELL_LEVEL_3, color) : view.setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
    }
  }

  renderPlayerDown(cells: number[][], color: number) {
    for (let i = 0; i < this.playerDownCellViews.length; i++) {
      for (let j = 0; j < this.playerDownCellViews[i].length; j++) {
        this.playerDownCellViews[i][j].setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
        this.playerDownCellViews[i][j].setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
        this.playerDownCellViews[i][j].setColor(CELL_LEVEL_3, CELL_COLOR_NONE);

        this.playerDownCellViews[i][j].setMovable(false);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const view = this.playerDownCellViews[i];

      cell[CELL_LEVEL_1] ?
        (view[0].setColor(CELL_LEVEL_1, color), view[0].setMovable(true)) : view[0].setColor(CELL_LEVEL_1, CELL_COLOR_NONE);
      cell[CELL_LEVEL_2] ?
        (view[1].setColor(CELL_LEVEL_2, color), view[1].setMovable(true)) : view[1].setColor(CELL_LEVEL_2, CELL_COLOR_NONE);
      cell[CELL_LEVEL_3] ?
        (view[2].setColor(CELL_LEVEL_3, color), view[2].setMovable(true)) : view[2].setColor(CELL_LEVEL_3, CELL_COLOR_NONE);
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

  renderWinnerPosition(positions: number[][]) {
    for (let i = 0; i < this.battleCellViews.length; i++) {
      for (let j = 0; j < this.battleCellViews[i].length; j++) {
        this.battleCellViews[i][j].setWinner(false);
      }
    }

    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      this.battleCellViews[x][y].setWinner(true);
    }
  }

  drawPlayerLeft(x: number, level: number, color: number) {
    const view = this.playerLeftCellViews[x];
    view.setColor(level, color);
  }

  drawPlayerUp(x: number, level: number, color: number) {
    const view = this.playerUpCellViews[x];
    view.setColor(level, color);
  }

  drawPlayerRight(x: number, level: number, color: number) {
    const view = this.playerRightCellViews[x];
    view.setColor(level, color);
  }

  drawPlayerDown(x: number, level: number, color: number) {
    const view = this.playerDownCellViews[x][level];
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

  onCellViewMove({view}: { view: CellView }) {
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

  onCellViewOut({view}: { view: CellView }) {
    this.onCellViewMove({view});

    for (let i = 0; i < this.battleCellViews.length; i++) {
      for (let j = 0; j < this.battleCellViews[i].length; j++) {
        this.battleCellViews[i][j].setSelected(false);
      }
    }

    rocket.emit(EVENT_CELL_VIEW_PUT, {view, x: this.selectedX, y: this.selectedY});
  }

  setMaskVisible(flag: boolean) {
    this.maskView.visible = !!flag;
  }

  setControlVisible(flag: boolean) {
    this.controlView.visible = !!flag;
  }
}
