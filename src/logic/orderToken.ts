import {House} from './house';
export enum OrderTokenType {
    march_minusOne = 0,
    march_zero,
    march_special,
    defend_0,
    defend_1,
    defend_special,
    support_0,
    support_1,
    support_special,
    raid_0,
    raid_1,
    raid_special,
    consolidatePower_0,
    consolidatePower_1,
    consolidatePower_special

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

    public isMoveToken(): boolean {
        return this.type === OrderTokenType.march_minusOne || this.type === OrderTokenType.march_zero || this.type === OrderTokenType.march_special;
    }

    public isConsolidatePowerToken(): boolean {
        return this.type === OrderTokenType.consolidatePower_0 || this.type === OrderTokenType.consolidatePower_1 || this.type === OrderTokenType.consolidatePower_special;
    }
}