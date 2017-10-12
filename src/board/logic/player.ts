import {House} from './house';
import Card from '../../cards/logic/houseCard';
import AI from '../../ai/ai';
export default class Player {

    private _house: House;
    private _powerToken: number;

    private _cards: Array<Card>;
    private _ai: AI;

    constructor(house: House, powerToken: number, ai: AI, cards: Array<Card>) {
        this._powerToken = powerToken;
        this._house = house;
        this._ai = ai || null;

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

    get ai(): AI {
        return this._ai;
    }
}