import {Controller} from '../../framework/controller';
import {RoomModel} from '../model/room-model';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';
import bottle from '../../framework/bottle';

export class RoomGameController extends Controller {
  private roomModel: RoomModel= bottle.inject(RoomModel);

  constructor() {
    super();
  }

  put(peerId, fromX, fromLevel, toX, toY, toLevel) {
    const idx = this.roomModel.peerIds.indexOf(peerId);

    if (idx != this.roomModel.idx) {
      throw new Error('Not a valid turn');
    }

    const playerId = PLAYER_IDS[idx];

    if (this.roomModel.playerCells[idx][fromX][fromLevel] !== playerId) {
      throw new Error('Not a valid source coordinate');
    }

    if (this.roomModel.battleCells[toX][toY][toLevel] !== PLAYER_NONE) {
      throw new Error('Not a valid target coordinate');
    }

    this.roomModel.playerCells[idx][fromX][fromLevel] = PLAYER_NONE;
    this.roomModel.battleCells[toX][toY][toLevel] = playerId;
  }

  nextTurn() {
    this.roomModel.idx = (this.roomModel.idx + 1) % this.roomModel.peerIds.length;
    return this.roomModel.idx;
  }

  reset() {
    this.roomModel.playerCells = [];
    for (let i = 0; i < 4; i++) {
      this.roomModel.playerCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.roomModel.playerCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.roomModel.playerCells[i][j][k] = i < this.roomModel.count ? PLAYER_IDS[i] : PLAYER_NONE;
        }
      }
    }

    this.roomModel.battleCells = [];
    for (let i = 0; i < 3; i++) {
      this.roomModel.battleCells[i] = [];
      for (let j = 0; j < 3; j++) {
        this.roomModel.battleCells[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.roomModel.battleCells[i][j][k] = PLAYER_NONE;
        }
      }
    }

    this.roomModel.boardId = Math.random().toString(36).slice(-5);
  }

  checkFinish() {
    let positions;

    positions = this.checkFinishType1();
    if (positions.length) {
      console.log('match type 1');
      return positions;
    }

    positions = this.checkFinishType2();
    if (positions.length) {
      console.log('match type 2');
      return positions;
    }

    positions = this.checkFinishType3();
    if (positions.length) {
      console.log('match type 3');
      return positions;
    }

    positions = this.checkFinishType4();
    if (positions.length) {
      console.log('match type 4');
      return positions;
    }

    positions = this.checkFinishType5();
    if (positions.length) {
      console.log('match type 5');
      return positions;
    }

    positions = this.checkFinishType6();
    if (positions.length) {
      console.log('match type 6');
      return positions;
    }

    positions = this.checkFinishType7();
    if (positions.length) {
      console.log('match type 7');
      return positions;
    }

    return [];
  }

  checkFinishType1() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      for (let j = 0; j < battle[i].length; j++) {
        if (battle[i][j][0] != PLAYER_NONE &&
          battle[i][j][0] == battle[i][j][1] && battle[i][j][1] == battle[i][j][2]) {
          positions.push([i, j]);

          found = true;
        }

        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType2() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      for (let j = 0; j < battle[i][0].length; j++) {
        if (battle[i][0][j] != PLAYER_NONE &&
          battle[i][0][j] == battle[i][1][j] && battle[i][1][j] == battle[i][2][j]) {
          positions.push([i, 0]);
          positions.push([i, 1]);
          positions.push([i, 2]);

          found = true;
        }

        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType3() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle[0].length; i++) {
      for (let j = 0; j < battle[0][i].length; j++) {
        if (battle[0][i][j] != PLAYER_NONE &&
          battle[0][i][j] == battle[1][i][j] && battle[1][i][j] == battle[2][i][j]) {
          positions.push([0, i]);
          positions.push([1, i]);
          positions.push([2, i]);

          found = true;
        }
        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType4() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle.length; i++) {
      if (battle[i][0][0] != PLAYER_NONE &&
        battle[i][0][0] == battle[i][1][1] && battle[i][1][1] == battle[i][2][2]) {
        positions.push([i, 0]);
        positions.push([i, 1]);
        positions.push([i, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[i][2][0] != PLAYER_NONE &&
        battle[i][2][0] == battle[i][1][1] && battle[i][1][1] == battle[i][0][2]) {
        positions.push([i, 0]);
        positions.push([i, 1]);
        positions.push([i, 2]);

        found = true;
      }

      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType5() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < battle[0].length; i++) {
      if (battle[0][i][0] != PLAYER_NONE &&
        battle[0][i][0] == battle[1][i][1] && battle[1][i][1] == battle[2][i][2]) {
        positions.push([0, i]);
        positions.push([1, i]);
        positions.push([2, i]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][i][0] != PLAYER_NONE &&
        battle[2][i][0] == battle[1][i][1] && battle[1][i][1] == battle[0][i][2]) {
        positions.push([0, i]);
        positions.push([1, i]);
        positions.push([2, i]);

        found = true;
      }

      if (found) {
        break;
      }
    }

    return positions;
  }

  checkFinishType6() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < 3; i++) {
      if (battle[0][0][i] != PLAYER_NONE &&
        battle[0][0][i] == battle[1][1][i] && battle[1][1][i] == battle[2][2][i]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][i] != PLAYER_NONE &&
        battle[2][0][i] == battle[1][1][i] && battle[1][1][i] == battle[0][2][i]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }
    }
    return positions;
  }

  checkFinishType7() {
    const battle = this.roomModel.battleCells;
    const positions = [];

    let found = false;
    for (let i = 0; i < 3; i++) {
      if (battle[0][0][0] != PLAYER_NONE &&
        battle[0][0][0] == battle[1][1][1] && battle[1][1][1] == battle[2][2][2]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[0][0][2] != PLAYER_NONE &&
        battle[0][0][2] == battle[1][1][1] && battle[1][1][1] == battle[2][2][0]) {
        positions.push([0, 0]);
        positions.push([1, 1]);
        positions.push([2, 2]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][0] &&
        battle[2][0][0] == battle[1][1][1] && battle[1][1][1] == battle[0][2][2]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }

      if (found) {
        break;
      }

      if (battle[2][0][2] &&
        battle[2][0][2] == battle[1][1][1] && battle[1][1][1] == battle[0][2][0]) {
        positions.push([0, 2]);
        positions.push([1, 1]);
        positions.push([2, 0]);

        found = true;
      }

      if (found) {
        break;
      }
    }
    return positions;
  }
}
