import * as PIXI from 'pixi.js';

import {View} from '../../framework/view';

export class GameView extends View {
  private background: PIXI.Sprite;

  constructor() {
    super();
  }

  public init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0x333333;
    this.addChild(this.background);
  }
}
