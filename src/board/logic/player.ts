import {House} from './house';
import Card from '../../cards/logic/houseCard';
export default class Player {

    private _house: House;
    private _powerToken: number;
    private _computerOpponent: boolean;
    private _cards: Array<Card>;

    constructor(house: House, powerToken: number, computerOpponent: boolean, cards: Array<Card>) {
        this._powerToken = powerToken;
        this._house = house;
        this._computerOpponent = computerOpponent;
        this._cards = cards;
    }


    get powerToken(): number {
        return this._powerToken;
    }

    set powerToken(value: number) {
        this._powerToken = value;
    }
    get house(): House {
        return this._house;
    }
    get computerOpponent(): boolean {
        return this._computerOpponent;
    }

    get cards(): Array<Card> {
        return this._cards;
    }
}