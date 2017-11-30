import {Area} from '../area';
import {WesterosCard} from '../../cards/westerosCard';
import Player from '../player';
import {House} from '../house';
import {TSMap} from 'typescript-map';
import {OrderTokenType} from '../../orderToken/orderTokenType';
export default class GameState {

    private _wildlingsCount: number;
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

    get currentlyAllowedSupply(): TSMap<House, number> {
        return this._currentlyAllowedSupply;

    }

    get currentlyAllowedTokenTypes(): Array<OrderTokenType> {
        return this._currentlyAllowedTokenTypes;
    }

    get fiefdom(): Array<House> {
        return this._fiefdom;
    }

    get kingscourt(): Array<House> {
        return this._kingscourt;
    }

    get ironThroneSuccession(): Array<House> {
        return this._ironThroneSuccession;
    }

    get players(): Array<Player> {
        return this._players;
    }

    get currentPlayer(): Player {
        return this._currentPlayer;
    }

    get westerosCards3(): Array<WesterosCard> {
        return this._westerosCards3;
    }

    get westerosCards2(): Array<WesterosCard> {
        return this._westerosCards2;
    }

    get westerosCards1(): Array<WesterosCard> {
        return this._westerosCards1;
    }

    get currentWesterosCard(): WesterosCard {
        return this._currentWesterosCard;
    }

    get areasAllowedToRecruit(): Array<Area> {
        return this._areasAllowedToRecruit;
    }

    get areas(): Array<Area> {
        return this._areas;
    }

    get wildlingsCount(): number {
        return this._wildlingsCount;
    }

    set currentlyAllowedSupply(value: TSMap<House, number>) {
        this._currentlyAllowedSupply = value;
    }

    set currentlyAllowedTokenTypes(value: Array<OrderTokenType>) {
        this._currentlyAllowedTokenTypes = value;
    }

    set fiefdom(value: Array<House>) {
        this._fiefdom = value;
    }

    set kingscourt(value: Array<House>) {
        this._kingscourt = value;
    }

    set ironThroneSuccession(value: Array<House>) {
        this._ironThroneSuccession = value;
    }

    set players(value: Array<Player>) {
        this._players = value;
    }

    set currentPlayer(value: Player) {
        this._currentPlayer = value;
    }

    set westerosCards3(value: Array<WesterosCard>) {
        this._westerosCards3 = value;
    }

    set westerosCards2(value: Array<WesterosCard>) {
        this._westerosCards2 = value;
    }

    set westerosCards1(value: Array<WesterosCard>) {
        this._westerosCards1 = value;
    }

    set currentWesterosCard(value: WesterosCard) {
        this._currentWesterosCard = value;
    }

    set areasAllowedToRecruit(value: Array<Area>) {
        this._areasAllowedToRecruit = value;
    }

    set areas(value: Array<Area>) {
        this._areas = value;
    }

    set wildlingsCount(value: number) {
        this._wildlingsCount = value;
    }
}