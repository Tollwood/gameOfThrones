import GameState from '../src/logic/board/gameState/GameState';
import {Area} from '../src/logic/board/area';
import {House} from '../src/logic/board/house';
import {UnitType} from '../src/logic/units/unitType';
import {OrderToken} from '../src/logic/orderToken/orderToken';
import Unit from '../src/logic/units/units';
import {AreaKey} from '../src/logic/board/areaKey';
import {OrderTokenType} from '../src/logic/orderToken/orderTokenType';
import HousecCard from '../src/logic/cards/houseCard';
import {CardExecutionPoint} from '../src/logic/cards/cardExecutionPoint';
export default class HouseCardBuilder {

    private _leaderName: string;
    private _artWork: string;
    private _combatStrength: number;
    private _sword: number;
    private _fortification: number;
    private _ability: string;
    private _abilityFn: string;
    private _house: House;
    private _played: boolean;
    private _cardExecutionPoint: CardExecutionPoint;
    private _id: number;

    public played(){
        this._played = true;
        return this;
    }
    public house(house:House){
        this._house = house;
        return this;
    }

    public build(): HousecCard {
        let houseCard = new HousecCard(this._id,this._leaderName,this._artWork, this._combatStrength, this._sword, this._fortification, this._ability, this._abilityFn, this._house,this._cardExecutionPoint);
        houseCard.played = this._played
        return houseCard;

    }
}