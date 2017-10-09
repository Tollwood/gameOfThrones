import {House} from '../../board/logic/house';
import {UnitType} from './unitType';
export default class Unit {
    private type: UnitType;
    private house: House;

    constructor(type: UnitType, house: House) {
        this.type = type;
        this.house = house;
    }

    public getType(): UnitType {
        return this.type;
    }

    public getHouse(): House {
        return this.house;
    }

    public isLandunit(): boolean {
        return this.type !== UnitType.Ship;
    }
}

