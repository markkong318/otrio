import * as PIXI from 'pixi.js';

import {View} from '../../framework/view';
import {CellView} from './cell-view';
import {Size} from '../../framework/size';
import {BoardView} from './board-view';

export class GameView extends View {
  private background: PIXI.Sprite;
  private boardView: BoardView

  constructor() {
    super();
  }

  public init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xf9f1e1;
    this.addChild(this.background);

    // const message = new PIXI.Text("Hello World!");
    // message.x = 200;
    // message.y = 200;
    // message.style.fontSize = "100px"
    // message.style.fill = "black";
    // this.addChild(message);

    // const cell = new CellView();
    // cell.size = new Size(96, 96);
    // cell.x = 100;
    // cell.y = 100;
    // cell.init();
    // this.addChild(cell);

    this.boardView = new BoardView();
    this.boardView.init();
    this.addChild(this.boardView);
  }
}
