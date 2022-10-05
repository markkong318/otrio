import {View} from '../../../framework/view';
import * as PIXI from 'pixi.js';

export class ErrorDialogView extends View {
  private background: PIXI.Sprite;
  private container: PIXI.Container;

  private message: PIXI.Text;

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xf9f1e1;
    this.addChild(this.background);

    this.container = new PIXI.Container();
    this.addChild(this.container);

    this.message = new PIXI.Text('No Message');
    this.message.x = this.width / 2;
    this.message.anchor.x = 0.5;
    this.message.style.fontSize = '26px';
    this.message.style.fill = 'black';
    this.message.style.align = 'center';
    this.message.style.fontFamily = 'lato';
    this.container.addChild(this.message);

    this.container.y = (this.size.height - this.container.height) / 2;

    this.visible = false;
  }

  setMessage(msg: string) {
    this.message.text = msg;
  }
}
