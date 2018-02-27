import {Component} from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import {Board} from './board/states/game/Board';
import Preloader from './board/states/preloader';
import {GameLogic, GameLogicFactory, House, PlayerSetup} from 'got-store';

@Component({
  selector: 'app-got-game',
  templateUrl: './got-game.component.html',
  styleUrls: ['./got-game.component.scss']
})
export class GotGameComponent {


  constructor() {
    const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
    const gameLogic: GameLogic = GameLogicFactory.create(playerSetup, true);
    const board = new Board(gameLogic);

    const game: Phaser.Game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder');
    game.state.add('preloader', Preloader);
    game.state.start('preloader');
    game.state.add('game', board);
    return game;
  }
}
