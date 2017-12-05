import GameState from '../src/logic/board/gameState/GameState';
import {Area} from '../src/logic/board/area';
import {House} from '../src/logic/board/house';
import {UnitType} from '../src/logic/units/unitType';
import {OrderToken} from '../src/logic/orderToken/orderToken';
import Unit from '../src/logic/units/units';
import {AreaKey} from '../src/logic/board/areaKey';
import {OrderTokenType} from '../src/logic/orderToken/orderTokenType';
export default class AreaBuilder {

    private _key: AreaKey;
    private _consolidatePower: number;
    private harbor: boolean = false;
    private _castle: boolean = false;
    private _stronghold: boolean = false;
    private _supply: number = 0;
    private _borders: Area[] = [];
    private _units: Array<UnitType> = [];
    private _isLandArea: boolean = true;
    private _controllingHouse: House = null;
    private _gameState: GameState = null;
    private _orderTokenType: OrderTokenType = null;

    constructor(key: AreaKey) {
        this._key = key;
    }

    public withOrderToken(orderTokenType: OrderTokenType): AreaBuilder {
        this._orderTokenType = orderTokenType;
        return this;
    }

    public  withUnits(units: Array<UnitType>): AreaBuilder {
        this._units = units;
        return this;
    }

    public  withHouse(house: House): AreaBuilder {
        this._controllingHouse = house;
        return this;
    }

    public withConsolidatePower(power: number) {
        this._consolidatePower = power;
        return this;
    }
    public withSupply(supply: number): AreaBuilder {
        this._supply = supply;
        return this;
    }

    public withCastle(): AreaBuilder {
        this._castle = true;
        return this;
    }

    public withStronghold(): AreaBuilder {
        this._stronghold = true;
        return this;
    }

    public withBorders(borders: Area[]): AreaBuilder {
        this._borders = borders;
        return this;
    }

    public isSeaArea(): AreaBuilder {
        this._isLandArea = false;
        return this;
    }

    public build(): Area {
        let area = new Area(this._key, this._consolidatePower, this.harbor, this._castle, this._stronghold, this._isLandArea, this._supply, this._borders, this._controllingHouse);
        area.orderToken = this._controllingHouse !== null && this._orderTokenType !== null ? new OrderToken(this._controllingHouse, this._orderTokenType) : null;

        this._units.forEach((type) => {
            area.units.push(new Unit(type, this._controllingHouse));
        });

        return area;

    }
}