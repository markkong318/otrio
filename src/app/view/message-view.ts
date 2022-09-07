import {View} from '../../framework/view';
import * as PIXI from 'pixi.js';

export class MessageView extends View {
  private background: PIXI.Sprite;
  private messageText: PIXI.Text;

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xc5a26d;
    this.addChild(this.background);

    this.messageText = new PIXI.Text("Hello World!");
    this.messageText.x = this.size.width / 2;
    this.messageText.y = this.size.height / 2;
    this.messageText.anchor.x = 0.5
    this.messageText.anchor.y = 0.5
    this.messageText.style.fontSize = "40px"
    this.messageText.style.fill = "white";
    this.addChild(this.messageText);
  }

  setText(text: string) {
    this.messageText.text = text;
  }
}
