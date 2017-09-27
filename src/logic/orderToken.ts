import {House} from './house';
export enum OrderTokenType {
    march_minusOne = 0,
    march_zero,
    march_special,
    defense,
    defense_power,
    support,
    support_power,
    raid,
    raid_power,
    consolidate_power,
    consolidate_power_special
}

export class OrderToken {
    private house: House;
    private type: OrderTokenType;

    constructor(house: House, type: OrderTokenType) {
        this.house = house;
        this.type = type;
    }

    public getHouse(): House {
        return this.house;
    }

    public getType(): OrderTokenType {
        return this.type;
    }
}