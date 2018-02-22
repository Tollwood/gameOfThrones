import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import Preloader from './states/preloader';
import Game from './states/game/game';

export class GameFactory {

  public static initGame(): Phaser.Game {

    const game: Phaser.Game =  new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder');

    game.state.add('preloader', Preloader);
    game.state.start('preloader');
    game.state.add('game', Game);

    return game;
  }

}


