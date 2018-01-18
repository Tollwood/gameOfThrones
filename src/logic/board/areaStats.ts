import {AreaKey} from './areaKey';

export class AreaStats {

    private _key: AreaKey;
    private _consolidatePower: number;
    private harbor: boolean;
    private _castle: boolean;
    private _stronghold: boolean;
    private _supply: number;

    constructor(key: AreaKey, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, isLandArea: boolean, supply: number, borders: AreaKey[] = []) {
        this._key = key;
        this._consolidatePower = consolidatePower;
        this.harbor = harbor;
        this._castle = castle;
        this._stronghold = stronghold;
        this._supply = supply;
        this._isLandArea = isLandArea;
        this._borders = borders;
    }

    private _isLandArea: boolean;

    private _borders: AreaKey[];

    get key(): AreaKey {
        return this._key;
    }

    get borders(): AreaKey[] {
        return this._borders;
    }

    set borders(value: AreaKey[]) {
        this._borders = value;
    }

    get isLandArea(): boolean {
        return this._isLandArea;
    }

    get consolidatePower(): number {
        return this._consolidatePower;
    }

    get stronghold(): boolean {
        return this._stronghold;
    }

    get castle(): boolean {
        return this._castle;
    }

    get supply(): number {
        return this._supply;
    }

    hasCastleOrStronghold(): boolean {
        return this._castle || this._stronghold;
    }

    copy() {
        return new AreaStats(this.key, this.consolidatePower, this.harbor, this.castle, this.stronghold, this.isLandArea, this.supply, this.borders);
    }
}