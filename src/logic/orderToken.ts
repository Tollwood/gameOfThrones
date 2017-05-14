import {House} from './house';
export enum OrderTokenType {
    march = 0,
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