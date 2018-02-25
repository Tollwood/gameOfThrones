import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import Preloader from './states/preloader';
import {GameState} from './states/game/gameUiState';
import {GameLogic, GameLogicFactory, PlayerSetup} from 'got-store';

class GameUiFactory {


  public static initGame(playerSetup: PlayerSetup[]): Phaser.Game {
    const gameLogic: GameLogic = GameLogicFactory.create(playerSetup, true);
    const gameState = new GameState(gameLogic);

    const game: Phaser.Game =  new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder');
    game.state.add('preloader', Preloader);
    game.state.start('preloader');
    game.state.add('game', gameState);
    return game;
  }

}


export {GameUiFactory}
