import * as PIXI from 'pixi.js';
import Bottle from '../../framework/bottle';
import bottle from '../../framework/bottle';

export class CellTexture {
  private renderer: PIXI.Renderer;

  public LEVEL_1: PIXI.RenderTexture;
  public LEVEL_2: PIXI.RenderTexture;
  public LEVEL_3: PIXI.RenderTexture;
  public RECT: PIXI.RenderTexture;

  init() {
    this.renderer = <PIXI.Renderer>Bottle.getObject(PIXI.Renderer);

    this.renderLevel0();
    this.renderLevel1();
    this.renderLevel2();
    this.renderRect();

    bottle.setObject(this);
  }

  private renderLevel0() {
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff);
    g.drawCircle(0, 0, 8);
    g.endFill();

    this.LEVEL_1 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderLevel1() {
    const g = new PIXI.Graphics();
    g.lineStyle(8, 0xffffff);
    g.drawCircle(0, 0, 19);
    g.endFill();

    this.LEVEL_2 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderLevel2() {
    const g = new PIXI.Graphics();
    g.lineStyle(8, 0xffffff);
    g.drawCircle(0, 0, 35);
    g.endFill();

    this.LEVEL_3 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderRect() {
    const g = new PIXI.Graphics();
    g.beginFill(0xcccccc);
    g.drawRoundedRect(
      0,
      0,
      96,
      96,
      30
    );
    g.endFill();

    this.RECT = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }
}
