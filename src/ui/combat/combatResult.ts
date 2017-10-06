import {House} from '../../logic/house';
import {Unit} from '../../logic/units';
import {Area} from '../../logic/area';
import Card from '../../cards/card';
export default class CombatResult {

    private _attackingArea: Area;
    private _attackersCard: Card;
    private _defendingArea: Area;
    private _defendersCard: Card;
    private _winner: House;
    private _looser: House;
    private _lostUnits: Array<Unit>;


    constructor(attackingArea: Area, defendingArea: Area, winner: House, looser: House, lostUnits: Array<Unit>, attackersCard: Card, defendersCard: Card) {
        this._attackingArea = attackingArea;
        this._defendingArea = defendingArea;
        this._winner = winner;
        this._looser = looser;
        this._lostUnits = lostUnits;
        this._attackersCard = attackersCard;
        this._defendersCard = defendersCard;

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

    get defendersCard(): Card {
        return this._defendersCard;
    }

    get attackersCard(): Card {
        return this._attackersCard;
    }
}