import * as PIXI from 'pixi.js';

import {View} from '../../framework/view';
import bottle from '../../framework/bottle';
import {CircleTexture} from '../texture/circle-texture';
import {CELL_LEVEL_1, CELL_LEVEL_2, CELL_LEVEL_3} from '../env/cell';
import {BoardView} from './board-view';

export class CellView extends View {
  private background: PIXI.Sprite;

  private levelSprites: PIXI.Sprite[];
  private selectedSprite: PIXI.Sprite;

  private isDragged: boolean = false;
  private dragPoint: PIXI.Point;

  constructor() {
    super();
  }

  public init() {
    this.background = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.background.width = this.size.width;
    this.background.height = this.size.height;
    this.addChild(this.background);

    const circleTexture = <CircleTexture>bottle.getObject(CircleTexture);

    this.selectedSprite = new PIXI.Sprite(circleTexture.SELECTED);
    this.selectedSprite.x = this.width / 2;
    this.selectedSprite.y = this.height / 2;
    this.selectedSprite.anchor.x = 0.5;
    this.selectedSprite.anchor.y = 0.5;
    this.selectedSprite.visible = false;
    this.addChild(this.selectedSprite);

    this.levelSprites = [];

    this.levelSprites[CELL_LEVEL_1] = new PIXI.Sprite(circleTexture.LEVEL1);
    this.levelSprites[CELL_LEVEL_1].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_1].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_1].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_1].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_1]);

    this.levelSprites[CELL_LEVEL_2] = new PIXI.Sprite(circleTexture.LEVEL2);
    this.levelSprites[CELL_LEVEL_2].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_2].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_2].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_2].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_2]);

    this.levelSprites[CELL_LEVEL_3] = new PIXI.Sprite(circleTexture.LEVEL3);
    this.levelSprites[CELL_LEVEL_3].x = this.width / 2;
    this.levelSprites[CELL_LEVEL_3].y = this.height / 2;
    this.levelSprites[CELL_LEVEL_3].anchor.x = 0.5;
    this.levelSprites[CELL_LEVEL_3].anchor.y = 0.5;
    this.addChild(this.levelSprites[CELL_LEVEL_3]);
  }

  public setColor(level, color) {
    if (level < 0 || level >  this.levelSprites.length - 1) {
      throw new Error('not a valid level:' + level);
    }

    this.levelSprites[level].visible = !!color;

    if (color) {
      this.levelSprites[level].tint = color;
    }
  }

  public setSelected(flag) {
    this.selectedSprite.visible = !!flag;
  }

  public setMovable() {
    this.interactive = true;
    this.buttonMode = true;

    this.on('pointerdown', this.onPointerDown)
    this.on('pointermove', this.onPointerMove);
    this.on('pointerup', this.onPointerOut)
  }

  onPointerDown(event: PIXI.InteractionEvent) {
    console.log('onPointerDown')
    const {
      data: {
        global,
      }
    } = event;

    const point = this.toLocal(global);

    this.isDragged = true;
    this.dragPoint = point;
  }

  onPointerMove(event: PIXI.InteractionEvent) {
    if (!this.isDragged) {
      return;
    }

    const {
      data: {
        global,
      }
    } = event;

    const point = this.parent.toLocal(global);

    this.position.x = point.x - this.dragPoint.x;
    this.position.y = point.y - this.dragPoint.y;

    (<BoardView>this.parent).onBattleViewOver(this);
  }

  onPointerOut(event: PIXI.InteractionEvent) {
    console.log('onPointerOut')
    this.isDragged = false;
  }
}
