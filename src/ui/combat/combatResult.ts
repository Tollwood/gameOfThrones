import {House} from '../../logic/house';
import {Unit} from '../../logic/units';
import {Area} from '../../logic/area';
export default class CombatResult {

    private _attackingArea: Area;
    private _defendingArea: Area;
    private _winner: House;
    private _looser: House;
    private _lostUnits: Array<Unit>;

    constructor(attackingArea: Area, defendingArea: Area, winner: House, looser: House, lostUnits: Array<Unit>) {
        this._attackingArea = attackingArea;
        this._defendingArea = defendingArea;
        this._winner = winner;
        this._looser = looser;
        this._lostUnits = lostUnits;

    }

    get attackingArea(): Area {
        return this._attackingArea;
    }

    get defendingArea(): Area {
        return this._defendingArea;
    }

    get winner(): House {
        return this._winner;
    }

    get looser(): House {
        return this._looser;
    }

    get lostUnits(): Array<Unit> {
        return this._lostUnits;
    }
}