import {House} from './house';
import Card from '../cards/houseCard';
export default class Player {

    private _house: House;
    private _powerToken: number;

    private _cards: Array<Card>;


    constructor(house: House, powerToken: number, cards: Array<Card>) {
        this._powerToken = powerToken;
        this._house = house;
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

    get cards(): Array<Card> {
        return this._cards;
    }

}