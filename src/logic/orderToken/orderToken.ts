import {House} from '../board/house';
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
    private _value: number;

    constructor(house: House, type: OrderTokenType) {
        this.house = house;
        this.type = type;
        this._value = OrderToken.getValue(type);
    }

    public getHouse(): House {
        return this.house;
    }

    public getType(): OrderTokenType {
        return this.type;
    }

    get value(): number {
        return this._value;
    }

    public isMoveToken(): boolean {
        return this.type === OrderTokenType.march_minusOne || this.type === OrderTokenType.march_zero || this.type === OrderTokenType.march_special;
    }

    public isConsolidatePowerToken(): boolean {
        return this.type === OrderTokenType.consolidatePower_0 || this.type === OrderTokenType.consolidatePower_1 || this.type === OrderTokenType.consolidatePower_special;
    }

    public isRaidToken(): boolean {
        return this.type === OrderTokenType.raid_0 || this.type === OrderTokenType.raid_1 || this.type === OrderTokenType.raid_special;
    }

    public isDefendToken(): boolean {
        return this.type === OrderTokenType.defend_0 || this.type === OrderTokenType.defend_1 || this.type === OrderTokenType.defend_special;
    }

    private static getValue(type: OrderTokenType): number {
        switch (type) {
            case OrderTokenType.march_minusOne:
                return -1;
            case OrderTokenType.march_zero:
                return 0;
            case OrderTokenType.march_special:
                return 1;
            case OrderTokenType.defend_0:
                return 1;
            case OrderTokenType.defend_1:
                return 1;
            case OrderTokenType.defend_special:
                return 2;
            case OrderTokenType.support_0:
                return 0;
            case OrderTokenType.support_1:
                return 0;
            case OrderTokenType.support_special:
                return 1;
            case OrderTokenType.raid_0:
            case OrderTokenType.raid_1:
            case OrderTokenType.raid_special:
            case OrderTokenType.consolidatePower_0:
            case OrderTokenType.consolidatePower_1:
            case OrderTokenType.consolidatePower_special:
                return 0;

        }
    }
}