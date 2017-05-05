import {House} from './house';
export enum UnitType {
    Footman = 1,
    Horse,
    Ship,
    Siege
}
export class Unit {
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
}

