import {Unit} from './units';
import {OrderToken} from './orderToken';
import {House} from './house';

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
    'TheMountainsOfTheMoon' |
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
    'Yronwood' |
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

    private _key: AreaKey;
    private _consolidatePower: number;
    private harbor: boolean;
    private castle: boolean;
    private stronghold: boolean;
    private supply: number;
    private _borders: Area[];
    private _units: Array<Unit>;
    private _orderToken: OrderToken;
    private _isLandArea: boolean;
    private _controllingHouse: House;


    constructor(key: AreaKey, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, isLandArea: boolean, supply: number, controllingHouse?: House) {
        this._key = key;
        this._consolidatePower = consolidatePower;
        this.harbor = harbor;
        this.castle = castle;
        this.stronghold = stronghold;
        this.supply = supply;
        this._borders = [];
        this._units = [];
        this._controllingHouse = controllingHouse;
        this._isLandArea = isLandArea;
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

    get borders(): Area[] {
        return this._borders;
    }

    set borders(value: Area[]) {
        this._borders = value;
    }

    get orderToken(): OrderToken {
        return this._orderToken;
    }

    set orderToken(value: OrderToken) {
        this._orderToken = value;
    }

    get isLandArea(): boolean {
        return this._isLandArea;
    }

    get controllingHouse(): House {
        return this._controllingHouse;
    }

    set controllingHouse(value: House) {
        this._controllingHouse = value;
    }

    get consolidatePower(): number {
        return this._consolidatePower;
    }
}