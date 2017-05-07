import {Unit} from './units';
import {OrderToken} from './orderToken';

export type AreaKey =
    'TheStonyShore' |
    'Winterfell' |
    'WhiteHarbor' |
    'CastleBlack' |
    'Karhold' |
    'WidowsWatch' |
    'FlintsFinger' |
    'GrayWaterWatch' |
    'MoatCailin' |
    'Seagard' |
    'TheTwins' |
    'TheFingers' |
    'Lannisport' |
    'TheEyrie' |
    'TheNarrowSea' |
    'BayOfIce' |
    'TheShiveringSea' |
    'SunsetSea' |
    'IronmansBay' |
    'Pyke' |
    'TheGoldenSound' |
    'Riverrun' |
    'TheMountainOfTheMoon' |
    'Harrenhal' |
    'StoneySept' |
    'CraicklawPoint' |
    'Dragonstone' |
    'BlackwaterBay' |
    'ShipbreakerBay' |
    'Kingswood' |
    'KingsLanding' |
    'Blackwater' |
    'SearoadMarches' |
    'Highgarden' |
    'StormsEnd' |
    'TheBoneway' |
    'DornishMarches' |
    'Oldtown' |
    'ThreeTowers' |
    'PrincesPass' |
    'Yornwood' |
    'Sunspear' |
    'SaltShore' |
    'Starfall' |
    'SeaOfDorne' |
    'TheArbor' |
    'RedwyneStraights' |
    'WestSummerSea' |
    'EastSummerSea' |
    'TheReach';


export class Area {
    get borders(): Area[] {
        return this._borders;
    }

    set borders(value: Area[]) {
        this._borders = value;
    }
    private key: string;
    private consolidatePower: number;
    private harbor: boolean;
    private castle: boolean;
    private stronghold: boolean;
    private supply: number;
    private _borders: Area[];
    private units: Array<Unit>;
    private orderToken: OrderToken;


    constructor(key: AreaKey, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, supply: number, units: Array<Unit> = new Array<Unit>()) {
        this.key = key;
        this.consolidatePower = consolidatePower;
        this.harbor = harbor;
        this.castle = castle;
        this.stronghold = stronghold;
        this.supply = supply;
        this._borders = [];
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