import {House} from '../board/logic/house';
import Unit from '../units/logic/units';
import {Area} from '../board/logic/area';
import HouseCard from '../cards/logic/houseCard';
export default class CombatResult {

    private _attackingArea: Area;
    private _attackersCard: HouseCard;
    private _attackerStrength: number;
    private _attackerSword: number;
    private _attackerFortification: number;

    private _defendingArea: Area;
    private _defendersCard: HouseCard;
    private _defenderStrength: number;
    private _defenderSword: number;
    private _defenderFortification: number;

    constructor(attackingArea: Area, defendingArea: Area, attackersCard: HouseCard, defendersCard: HouseCard, attackerStrength: number, defenderStrength: number, attackerSword: number, attackerFortification: number, defenderSword: number, defenderFortification: number) {
        this._attackingArea = attackingArea;
        this._defendingArea = defendingArea;
        this._attackersCard = attackersCard;
        this._defendersCard = defendersCard;
        this._attackerStrength = attackerStrength;
        this._defenderStrength = defenderStrength;
        this._attackerSword = attackerSword;
        this._attackerFortification = attackerFortification;
        this._defenderSword = defenderSword;
        this._defenderFortification = defenderFortification;
    }

    get attackingArea(): Area {
        return this._attackingArea;
    }

    get defendingArea(): Area {
        return this._defendingArea;
    }

    get looser(): House {
        return this._attackerStrength > this._defenderStrength ? this._defendingArea.controllingHouse : this._attackingArea.controllingHouse;
    }

    get lostUnits(): Array<Unit> {
        return this._attackingArea.controllingHouse === this.winner ? this.defendingArea.units : this.attackingArea.units;
    }

    get defendersCard(): HouseCard {
        return this._defendersCard;
    }

    get attackersCard(): HouseCard {
        return this._attackersCard;
    }

    get winner(): House {
        return this._attackerStrength > this._defenderStrength ? this._attackingArea.controllingHouse : this._defendingArea.controllingHouse;
    }

    get defenderStrength(): number {
        return this._defenderStrength;
    }

    set defenderStrength(value: number) {
        this._defenderStrength = value;
    }

    get attackerStrength(): number {
        return this._attackerStrength;
    }

    set attackerStrength(value: number) {
        this._attackerStrength = value;
    }

}