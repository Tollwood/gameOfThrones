import {House} from './house';

export default class Player {

    private _house: House;
    private _powerToken: number;


    constructor(house: House, powerToken: number) {
        this._powerToken = powerToken;
        this._house = house;
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

    copy(): Player {
        return new Player(this.house, this.powerToken);
    }
}