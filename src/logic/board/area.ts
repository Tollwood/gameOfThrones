import Unit from '../units/units';
import {OrderToken} from '../orderToken/orderToken';
import {House} from './house';
import {AreaKey} from './areaKey';

export class Area {

    private _key: AreaKey;
    private _controllingHouse: House;
    private _units: Array<Unit>;
    private _orderToken: OrderToken;


    constructor(key: AreaKey, controllingHouse: House = null, units: Unit[] = [], orderToken: OrderToken = null) {
        this._key = key;
        this._units = units;
        this._orderToken = orderToken;
        this._controllingHouse = controllingHouse;
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

    get orderToken(): OrderToken {
        return this._orderToken;
    }

    set orderToken(value: OrderToken) {
        this._orderToken = value;
    }

    get controllingHouse(): House {
        return this._controllingHouse;
    }

    set controllingHouse(value: House) {
        this._controllingHouse = value;
    }

    copy() {
        return new Area(this.key, this.controllingHouse, this.units, this.orderToken);
    }
}