import {Area} from '../area';
import {House} from '../house';
import CardFactory from '../../cards/cardFactory';
import {AreaInitiator} from '../areaInitiator';
import Player from '../player';
import PlayerSetup from '../playerSetup';
import AiPlayer from '../../ai/aiPlayer';
import SupplyRules from './supplyRules';
import TokenPlacementRules from './tokenPlacementRules';
import {GamePhase} from '../gamePhase';
import GameState from '../gameState/GameState';
import {AreaKey} from '../areaKey';
import {gameStore} from '../gameState/reducer';
import {incrementGameRound, resetGame} from '../gameState/actions';

export default class GameRules {
    static get gameState(): GameState {
        return this._gameState;
    }

    private static INITIAL_POWER_TOKEN: number = 5;
    private static _gameState: GameState;
    // New Game
    public static newGame() {
        this.initGame([new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)]);
    }

    public static initGame(playerSetup: Array<PlayerSetup>) {
        this._gameState = new GameState();
        gameStore.dispatch(resetGame());
        let player = [];
        playerSetup.forEach((config) => {

            if (config.ai) {
                player.push(new AiPlayer(config.house, this.INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
            }
            else {
                player.push(new Player(config.house, this.INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
            }
        });

        this._gameState.gamePhase = GamePhase.WESTEROS1;
        gameStore.dispatch(incrementGameRound(1));
        this._gameState.wildlingsCount = 0;
        this._gameState.areas = AreaInitiator.getInitalState(player.map(player => player.house));
        this._gameState.westerosCards1 = CardFactory.getWesterosCards(1);
        this._gameState.westerosCards2 = CardFactory.getWesterosCards(2);
        this._gameState.westerosCards3 = CardFactory.getWesterosCards(3);
        this._gameState.players = player;
        this._gameState.ironThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
        this._gameState.fiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
        this._gameState.kingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
        this._gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
        this._gameState.currentPlayer = player.filter((player) => {
            return player.house === this._gameState.ironThroneSuccession[0];
        })[0];
        SupplyRules.updateSupply();
    }


    public static load(gameState: GameState) {
        this._gameState = gameState;
    }

    public static save() {
        return this._gameState;
    }

    public static nextRound(): void {
        gameStore.dispatch(incrementGameRound(1));
    }

    public static getFirstFromIronThroneSuccession(): Player {
        return this._gameState.players.filter((player) => {
            return player.house === this._gameState.ironThroneSuccession[0];
        })[0];
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        return this._gameState.areas.filter((area) => {
            return area.key === areaKey;
        })[0];
    }

    public static getPlayerByHouse(house: House): Player {
        return this._gameState.players.filter((player) => {
            return player.house === house;
        })[0];
    }
}