import * as PIXI from 'pixi.js';
import QRCode from 'qrcode';

import {View} from '../../../framework/view';
import rocket from '../../../framework/rocket';
import {EVENT_ROOM_SEND_START} from '../../env/event';

export class RoomDialogView extends View {
  private background: PIXI.Sprite;
  private container: PIXI.Container;

  private qrCode: PIXI.Sprite;

  private welcome: PIXI.Text;
  private description: PIXI.Text;
  private here: PIXI.Text;
  private status: PIXI.Text;
  private start: PIXI.Text;

  private url: string;

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

    this.description = new PIXI.Text('Room is created\n Please share QR code or click');
    this.description.x = this.width / 2;
    this.description.y = 70;
    this.description.anchor.x = 0.5;
    this.description.style.fontSize = '26px';
    this.description.style.fill = 'black';
    this.description.style.align = 'center';
    this.description.style.fontFamily = 'lato';
    this.container.addChild(this.description);

    this.here = new PIXI.Text(navigator.share ? '>>HERE<<' : '>>COPY<<');
    this.here.x = this.width / 2;
    this.here.y = 130;
    this.here.anchor.x = 0.5;
    this.here.style.fontSize = '30px';
    this.here.style.fill = 'black';
    this.here.style.align = 'center';
    this.here.style.fontFamily = 'lato';
    this.here.interactive = true;
    this.here.buttonMode = true;
    this.here.on('pointerup', this.share, this);
    this.container.addChild(this.here);

    this.status = new PIXI.Text('Joined guest: 0');
    this.status.x = this.width / 2;
    this.status.y = 600;
    this.status.anchor.x = 0.5;
    this.status.style.fontSize = '26px';
    this.status.style.fill = 'black';
    this.status.style.align = 'center';
    this.status.style.fontFamily = 'lato';
    this.container.addChild(this.status);

    this.start = new PIXI.Text('>>START<<');
    this.start.x = this.width / 2;
    this.start.y = 650;
    this.start.anchor.x = 0.5;
    this.start.anchor.y = 0.5;
    this.start.style.fontSize = '30px';
    this.start.style.fill = 'black';
    this.start.style.align = 'center';
    this.start.style.fontFamily = 'lato';
    this.start.interactive = true;
    this.start.buttonMode = true;
    this.start.visible = false;
    this.start.on('pointerup', () => rocket.emit(EVENT_ROOM_SEND_START), this)
    this.container.addChild(this.start);

    this.container.y = (this.size.height - this.container.height) / 2;

    this.visible = false;
  }

  share() {
    if (!navigator.share) {
      navigator.clipboard.writeText(this.url);
      return;
    }

    navigator.share({
      title: document.title,
      text: `Let's play otrio!`,
      url: this.url,
    })
  }

  setUrl(url: string) {
    this.url = url;

    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, url,  (error) => {
      if (error) console.error(error)
      console.log('qr success!');

      const texture = PIXI.Texture.from(canvas);

      this.qrCode = new PIXI.Sprite(texture);
      this.qrCode.x = this.width / 2;
      this.qrCode.y = 370;
      this.qrCode.anchor.x = 0.5;
      this.qrCode.anchor.y = 0.5;
      this.qrCode.width = this.width - 100
      this.qrCode.height = this.qrCode.width;
      this.container.addChild(this.qrCode);
    });
  }

  setStartVisible(flag: boolean) {
    this.start.visible = !!flag;
  }



  setCount(count: number) {
    this.status.text = `Joined guest: ${count}`;
  }
}
