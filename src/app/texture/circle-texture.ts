import * as PIXI from 'pixi.js';
import Bottle from '../../framework/bottle';
import bottle from '../../framework/bottle';

export class CircleTexture {
  private renderer: PIXI.Renderer;

  public LEVEL1: PIXI.RenderTexture;
  public LEVEL2: PIXI.RenderTexture;
  public LEVEL3: PIXI.RenderTexture;
  public SELECTED: PIXI.RenderTexture;

  init() {
    this.renderer = <PIXI.Renderer>Bottle.getObject(PIXI.Renderer);

    this.renderLevel0();
    this.renderLevel1();
    this.renderLevel2();
    this.renderSelected();

    bottle.setObject(this);
  }

  private renderLevel0() {
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff);
    g.drawCircle(0, 0, 8);
    g.endFill();

    this.LEVEL1 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderLevel1() {
    const g = new PIXI.Graphics();
    g.lineStyle(8, 0xffffff);
    g.drawCircle(0, 0, 19);
    g.endFill();

    this.LEVEL2 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderLevel2() {
    const g = new PIXI.Graphics();
    g.lineStyle(8, 0xffffff);
    g.drawCircle(0, 0, 35);
    g.endFill();

    this.LEVEL3 = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }

  private renderSelected() {
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

    this.SELECTED = this.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR, 2);
  }
}
