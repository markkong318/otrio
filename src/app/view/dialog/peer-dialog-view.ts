import {View} from '../../../framework/view';
import * as PIXI from 'pixi.js';

export class PeerDialogView extends View {
  private background: PIXI.Sprite;
  private container: PIXI.Container;

  private welcome: PIXI.Text;
  private status: PIXI.Text;

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xf9f1e1;
    this.addChild(this.background);

    this.container = new PIXI.Container();
    this.addChild(this.container);

    this.welcome = new PIXI.Text('Welcome to play otrio!');
    this.welcome.x = this.width / 2;
    this.welcome.y = 0;
    this.welcome.anchor.x = 0.5;
    this.welcome.style.fontSize = '32px';
    this.welcome.style.fill = 'black';
    this.welcome.style.align = 'center';
    this.welcome.style.fontFamily = 'lato';
    this.container.addChild(this.welcome);

    this.status = new PIXI.Text('No status');
    this.status.x = this.width / 2;
    this.status.y = 630;
    this.status.anchor.x = 0.5;
    this.status.style.fontSize = '26px';
    this.status.style.fill = 'black';
    this.status.style.align = 'center';
    this.status.style.fontFamily = 'lato';
    this.container.addChild(this.status);

    this.container.y = (this.size.height - this.container.height) / 2;

    this.visible = false;
  }

  setStatus(msg: string) {
    this.status.text = msg;
  }
}
