import {House} from '../house';
import PlayerSetup from '../playerSetup';
import {gameStore} from '../gameState/reducer';
import {newGame} from '../gameState/actions';
import GameState from '../gameState/GameState';

// Deprecated remove this class once we got rid of GameState
export default class GameRules {
    static get gameState(): GameState {
        return this._gameState;
    }

    private static _gameState: GameState;
    // New Game
    public static newGame() {
        const playerSetup  = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
        gameStore.dispatch(newGame(playerSetup));
    }

    public static load(gameState: GameState) {
        this._gameState = gameState;
    }

    public static save() {
        return this._gameState;
    }
}