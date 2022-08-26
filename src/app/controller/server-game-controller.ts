import Peer, {MeshRoom} from 'skyway-js';
import {v4 as uuidv4} from 'uuid';

import {Controller} from '../../framework/controller';
import bottle from '../../framework/bottle';
import {ServerModel} from '../model/server-model';
import {API_KEY} from '../env/server';
import event from '../../framework/event';
import {EVENT_CLIENT_START, EVENT_SERVER_START} from '../env/event';
import {EventClientStartMsg} from '../env/msg';
import {PLAYER_IDS, PLAYER_NONE} from '../env/game';

export class ServerGameController extends Controller {
  private get serverModel(): ServerModel {return bottle.getObject(ServerModel)}

  constructor() {
    super();
    bottle.setObject(this);
  }

  init() {
    // this.serverModel = bottle.getObject(ServerModel);
  }



  put() {

  }

  reset() {
    this.serverModel.players = [];
    for (let i = 0; i < 4; i++) {
      this.serverModel.players[i] = [];
      for (let j = 0; j < 3; j++) {
        this.serverModel.players[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.serverModel.players[i][j][k] = i < this.serverModel.count ? PLAYER_IDS[i] : PLAYER_NONE;
        }
      }
    }

    this.serverModel.battle = [];
    for (let i = 0; i < 3; i++) {
      this.serverModel.battle[i] = [];
      for (let j = 0; j < 3; j++) {
        this.serverModel.battle[i][j] = [];
        for (let k = 0; k < 3; k++) {
          this.serverModel.battle[i][j][k] = PLAYER_NONE;
        }
      }
    }
  }

  checkFinish() {
    let positions;

    positions = this.checkFinishType1();
    if (positions.length) {
      console.log('type 1');
      return positions;
    }

    positions = this.checkFinishType2();
    if (positions.length) {
      console.log('type 2');
      return positions;
    }

    positions = this.checkFinishType3();
    if (positions.length) {
      console.log('type 3');
      return positions;
    }

    positions = this.checkFinishType4();
    if (positions.length) {
      console.log('type 4');
      return positions;
    }

    positions = this.checkFinishType5();
    if (positions.length) {
      console.log('type 5');
      return positions;
    }

    positions = this.checkFinishType6();
    if (positions.length) {
      console.log('type 6');
      return positions;
    }

    positions = this.checkFinishType7();
    if (positions.length) {
      console.log('type 7');
      return positions;
    }

    return null;
  }

  checkFinishType1() {
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
    const battle = this.serverModel.battle;
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
