import {House} from '../logic/house';
export default class Card {

    private _leaderName: string;
    private _artWork: string;
    private _combatStrength: number;
    private _sword: number;
    private _fortification: number;
    private _ability: string;
    private _abilityFn: string;
    private _house: House;

    constructor(leaderName: string, artWork: string, combatStrength: number, sword: number, fortification: number, ability: string, abilityFn: string, house: House) {
        this._leaderName = leaderName;
        this._artWork = artWork;
        this._combatStrength = combatStrength;
        this._sword = sword;
        this._fortification = fortification;
        this._ability = ability;
        this._abilityFn = abilityFn;
        this._house = house;

    }

    get house(): House {
        return this._house;
    }

    get ability(): string {
        return this._ability;
    }

    get fortification(): number {
        return this._fortification;
    }

    get sword(): number {
        return this._sword;
    }

    get combatStrength(): number {
        return this._combatStrength;
    }

    get artWork(): string {
        return this._artWork;
    }

    get leaderName(): string {
        return this._leaderName;
    }

    get abilityFn(): string {
        return this._abilityFn;
    }
}