import {Area} from './area';
import {GamePhase} from './gamePhase';
import {House} from './house';
import Player from './player';
import {WesterosCard} from '../../cards/logic/westerosCard';
import {OrderTokenType} from '../../orderToken/logic/orderToken';
import {TSMap} from 'typescript-map';

export default class GameState {

    private static gameState: GameState;

    private _gamePhase: GamePhase = GamePhase.WESTEROS1;
    private _round: number = 1;
    private _wildlingsCount: number = 0;
    private _areas: Array<Area> = [];
    private _areasAllowedToRecruit: Array<Area> = [];
    private _currentWesterosCard: WesterosCard = null;
    private _westerosCards1 = [];
    private _westerosCards2 = [];
    private _westerosCards3 = [];
    private _currentPlayer: Player;
    private _players: Array<Player> = [];
    private _ironThroneSuccession: Array<House> = [];
    private _kingscourt: Array<House> = [];
    private _fiefdom: Array<House> = [];
    private _currentlyAllowedTokenTypes: Array<OrderTokenType>;
    private _currentlyAllowedSupply: TSMap<House, number>;

    public static getInstance(): GameState {
        if (!this.gameState) {
            this.gameState = new GameState();
        }
        return this.gameState;
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

    get areasAllowedToRecruit(): Array<Area> {
        return this._areasAllowedToRecruit;
    }

    set areasAllowedToRecruit(value: Array<Area>) {
        this._areasAllowedToRecruit = value;
    }

    get currentWesterosCard(): WesterosCard {
        return this._currentWesterosCard;
    }

    set currentWesterosCard(value: WesterosCard) {
        this._currentWesterosCard = value;
    }

    set westerosCards3(value: WesterosCard[]) {
        this._westerosCards3 = value;
    }

    set westerosCards2(value: WesterosCard[]) {
        this._westerosCards2 = value;
    }

    set westerosCards1(value: WesterosCard[]) {
        this._westerosCards1 = value;
    }

    set players(value: Array<Player>) {
        this._players = value;
    }

    get currentlyAllowedSupply(): TSMap<House, number> {
        return this._currentlyAllowedSupply;
    }

    set currentlyAllowedSupply(value: TSMap<House, number>) {
        this._currentlyAllowedSupply = value;
    }

    getFirstFromIronThroneSuccession(): Player {
        return this._players.filter((player) => {
            return player.house === this.ironThroneSuccession[0];
        })[0];
    }
}