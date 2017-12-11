import Unit from '../units/units';
import {OrderToken} from '../orderToken/orderToken';
import {House} from './house';
import {AreaKey} from './areaKey';

export class Area {

    private _key: AreaKey;
    private _consolidatePower: number;
    private _controllingHouse: House;
    private _units: Array<Unit>;
    private _orderToken: OrderToken;
    private harbor: boolean;
    private _castle: boolean;
    private _stronghold: boolean;
    private _supply: number;
    private _borders: Area[];
    private _isLandArea: boolean;


    constructor(key: AreaKey, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, isLandArea: boolean, supply: number, borders: Area[] = [], controllingHouse: House = null) {
        this._key = key;
        this._consolidatePower = consolidatePower;
        this.harbor = harbor;
        this._castle = castle;
        this._stronghold = stronghold;
        this._supply = supply;
        this._units = [];
        this._orderToken = null;
        this._controllingHouse = controllingHouse;
        this._isLandArea = isLandArea;
        this._borders = borders;
    }

    get key(): AreaKey {
        return this._key;
    }

    get units(): Array<Unit> {
        return this._units;
    }

    set units(value: Array<Unit>) {
        this._units = value;
    }

    get borders(): Area[] {
        return this._borders;
    }

    set borders(value: Area[]) {
        this._borders = value;
    }

    get orderToken(): OrderToken {
        return this._orderToken;
    }

    set orderToken(value: OrderToken) {
        this._orderToken = value;
    }

    get isLandArea(): boolean {
        return this._isLandArea;
    }

    get controllingHouse(): House {
        return this._controllingHouse;
    }

    set controllingHouse(value: House) {
        this._controllingHouse = value;
    }

    get consolidatePower(): number {
        return this._consolidatePower;
    }

    get stronghold(): boolean {
        return this._stronghold;
    }

    get castle(): boolean {
        return this._castle;
    }

    get supply(): number {
        return this._supply;
    }

    hasCastleOrStronghold(): boolean {
        return this._castle || this._stronghold;
    }

}