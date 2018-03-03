import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import {Board} from './states/game/Board';
import Preloader from './states/preloader';
import {GameLogic, GameLogicFactory, House, PlayerSetup} from 'got-store';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnChanges {
  @Input()
  gameLogic: GameLogic;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.gameLogic.isFirstChange()) {
      const board = new Board(this.gameLogic);
      const game: Phaser.Game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder');
      game.state.add('preloader', Preloader);
      game.state.start('preloader');
      game.state.add('game', board);
    }
  }
}
