import {House} from './house';
export default class PlayerSetup {

    private _house: House;
    private _name: string;
    private _ai: boolean;

    constructor(house: House, ai: boolean, name?: string) {
        this._house = house;
        this._ai = ai;
        this._name = name;
    }

    get ai(): boolean {
        return this._ai;
    }

    get name(): string {
        return this._name;
    }

    get house(): House {
        return this._house;
    }
}