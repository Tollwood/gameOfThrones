import {Unit} from './units';
import {OrderToken} from './orderToken';

export class Area {
    private key: string;
    private consolidatePower: number;
    private harbor: boolean;
    private castle: boolean;
    private stronghold: boolean;
    private supply: number;
    private borders: Area[];
    private units: Array<Unit>;
    private orderToken: OrderToken;



    constructor(key: string, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, supply: number, units: Array<Unit> = new Array<Unit>()) {
        this.key = key;
        this.consolidatePower = consolidatePower;
        this.harbor = harbor;
        this.castle = castle;
        this.stronghold = stronghold;
        this.supply = supply;
        this.borders = [];
        this.units = units;
    }

    public getUnits(): Array<Unit> {
        return this.units;
    }

    public getKey(): string {
        return this.key;
    }

    public getOrderToken() {
        return this.orderToken;
    }

    public setOrderToken(orderToken: OrderToken) {
        this.orderToken = orderToken;
    }
}