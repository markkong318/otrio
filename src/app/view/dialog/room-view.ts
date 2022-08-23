import * as PIXI from 'pixi.js';
import QRCode from 'qrcode';

import {View} from '../../../framework/view';
import bottle from '../../../framework/bottle';
import {ServerController} from '../../controller/server-controller';

export class RoomView extends View {
  private background: PIXI.Sprite;
  private qrCode: PIXI.Sprite;

  constructor() {
    super();
    bottle.setObject(this);
  }

  init() {
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.background.tint = 0xf9f1e1;
    this.addChild(this.background);

    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, 'sample text',  (error) => {
      if (error) console.error(error)
      console.log('qr success!');

      const texture = PIXI.Texture.from(canvas);
      console.log('texture:')
      console.log(texture);
      this.qrCode = new PIXI.Sprite(texture);
      this.addChild(this.qrCode);
    });


  }
}
