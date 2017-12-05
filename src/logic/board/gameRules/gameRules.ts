import {Area} from '../area';
import {House} from '../house';
import Player from '../player';
import PlayerSetup from '../playerSetup';
import GameState from '../gameState/GameState';
import {AreaKey} from '../areaKey';
import {gameStore} from '../gameState/reducer';
import {newGame} from '../gameState/actions';

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

    public static getFirstFromIronThroneSuccession(): Player {
        return gameStore.getState().players.filter((player) => {
            return player.house === gameStore.getState().ironThroneSuccession[0];
        })[0];
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        return gameStore.getState().areas.filter((area) => {
            return area.key === areaKey;
        })[0];
    }

    public static getPlayerByHouse(house: House): Player {
        return gameStore.getState().players.filter((player) => {
            return player.house === house;
        })[0];
    }
}