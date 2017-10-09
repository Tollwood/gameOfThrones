import {Area} from './area';
import {AreaInitiator} from './initialArea';
import {GamePhase} from './gamePhase';
import {House} from './house';
import Player from './player';
import {WesterosCard} from '../../cards/logic/westerosCard';
import CardFactory from '../../cards/logic/cardFactory';
import {OrderTokenType} from '../../orderToken/logic/orderToken';
export default class GameState {

    private static gameState: GameState;

    private _gamePhase: GamePhase = GamePhase.WESTEROS1;
    private _round: number = 1;
    private _wildlingsCount: number = 0;
    private _areas: Array<Area> = [];
    private _westerosCards1 = [];
    private _westerosCards2 = [];
    private _westerosCards3 = [];
    private _currentPlayer: Player;
    private _players: Array<Player> = [];
    private _ironThroneSuccession: Array<House> = [];
    private _kingscourt: Array<House> = [];
    private _fiefdom: Array<House> = [];
    private _currentlyAllowedTokenTypes: Array<OrderTokenType>;

    public static INITIALLY_ALLOWED_ORDER_TOKEN_TYPES = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special, OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special, OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];

    public static getInstance(): GameState {
        if (!this.gameState) {
            this.gameState = new GameState();
        }
        return this.gameState;
    }

    public static initGame(player: Array<Player>) {
        this.gameState = new GameState();
        this.gameState._areas = AreaInitiator.getInitalState(player);
        this.gameState._westerosCards1 = CardFactory.getWesterosCards(1);
        this.gameState._westerosCards2 = CardFactory.getWesterosCards(2);
        this.gameState._westerosCards3 = CardFactory.getWesterosCards(3);
        this.gameState._players = player;
        this.gameState.currentPlayer = player.filter((player) => {
            return !player.computerOpponent;
        })[0];
        this.gameState._ironThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
        this.gameState._fiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
        this.gameState._kingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
        this.gameState._currentlyAllowedTokenTypes = GameState.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
        this.gameState._wildlingsCount = 0;
    }

    public static resetGame() {
        this.gameState = undefined;
    }

    public nextRound(): void {
        this._round++;
    }

    get gamePhase(): GamePhase {
        return this._gamePhase;
    }

    set gamePhase(value: GamePhase) {
        this._gamePhase = value;
    }

    get areas(): Array<Area> {
        return this._areas;
    }

    set areas(value: Array<Area>) {
        this._areas = value;
    }

    get round(): number {
        return this._round;
    }

    get currentPlayer(): Player {
        return this._currentPlayer;
    }

    set currentPlayer(value: Player) {
        this._currentPlayer = value;
    }

    get players(): Array<Player> {
        return this._players;
    }

    get ironThroneSuccession(): Array<House> {
        return this._ironThroneSuccession;
    }

    set ironThroneSuccession(value: Array<House>) {
        this._ironThroneSuccession = value;
    }

    get fiefdom(): Array<House> {
        return this._fiefdom;
    }

    set fiefdom(value: Array<House>) {
        this._fiefdom = value;
    }

    get kingscourt(): Array<House> {
        return this._kingscourt;
    }

    set kingscourt(value: Array<House>) {
        this._kingscourt = value;
    }

    get currentlyAllowedTokenTypes(): Array<OrderTokenType> {
        return this._currentlyAllowedTokenTypes;
    }

    set currentlyAllowedTokenTypes(value: Array<OrderTokenType>) {
        this._currentlyAllowedTokenTypes = value;
    }

    get westerosCards3(): WesterosCard[] {
        return this._westerosCards3;
    }

    get westerosCards2(): WesterosCard[] {
        return this._westerosCards2;
    }

    get westerosCards1(): WesterosCard[] {
        return this._westerosCards1;
    }

    set wildlingsCount(value: number) {
        this._wildlingsCount = value;
    }

    get wildlingsCount(): number {
        return this._wildlingsCount;
    }

    getFirstFromIronThroneSuccession(): Player {
        return this._players.filter((player) => {
            return player.house === this.ironThroneSuccession[0];
        })[0];
    }
}