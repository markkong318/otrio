import {View} from '../../../../framework/view';
import * as PIXI from 'pixi.js';
import rocket from '../../../../framework/rocket';
import {EVENT_ROOM_SEND_START} from '../../../env/event';

export class ControlView extends View {
  private background: PIXI.Sprite;
  private restart: PIXI.Text;

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.addChild(this.background);

    this.restart = new PIXI.Text('>>Restart<<');
    this.restart.x = this.size.width / 2;
    this.restart.y = this.size.height / 2;
    this.restart.anchor.x = 0.5
    this.restart.anchor.y = 0.5
    this.restart.style.fontSize = '26px';
    this.restart.style.fill = 'black';
    this.restart.interactive = true;
    this.restart.buttonMode = true;
    this.restart.on('pointerup', () => rocket.emit(EVENT_ROOM_SEND_START), this)
    this.addChild(this.restart);
  }
}
