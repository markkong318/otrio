import {View} from '../../../../framework/view';
import * as PIXI from 'pixi.js';

export class MessageView extends View {
  private background: PIXI.Sprite;
  private message: PIXI.Text;

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xc5a26d;
    this.addChild(this.background);

    this.message = new PIXI.Text('Initializing...');
    this.message.x = this.size.width / 2;
    this.message.y = this.size.height / 2;
    this.message.anchor.x = 0.5
    this.message.anchor.y = 0.5
    this.message.style.fontSize = '40px';
    this.message.style.fill = 'white';
    this.addChild(this.message);
  }

  setText(text: string) {
    this.message.text = text;
  }
}
