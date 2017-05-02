import {Unit} from "./units";

export class Area {
    private key: string;
    private consolidatePower: number;
    private harbor: boolean;
    private castle: boolean;
    private stronghold: boolean;
    private supply: number;
    borders: Area[];
    units: Array<Unit>;


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

}