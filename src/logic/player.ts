import {House} from "./house";
export default class Player {
    private _house: House;
    private _powerToken: number;
    private _computerOpponent: boolean;

    constructor(house: House, powerToken: number,computerOpponent: boolean) {
        this._powerToken = powerToken;
        this._house = house;
        this._computerOpponent = computerOpponent;
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

}