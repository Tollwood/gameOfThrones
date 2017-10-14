import {OrderTokenType} from '../orderToken/logic/orderToken';
import {Area} from '../board/logic/area';
export default class PossibleMove {

    private _orderTokenType: OrderTokenType;
    private _sourceArea: Area;
    private _targetArea: Area;
    private _value: number;

    constructor(orderTokenType: OrderTokenType, sourceArea: Area, value: number, targetArea?: Area) {
        this._orderTokenType = orderTokenType;
        this._sourceArea = sourceArea;
        this._targetArea = targetArea;
        this._value = value;
    }


    get orderTokenType(): OrderTokenType {
        return this._orderTokenType;
    }

    get sourceArea(): Area {
        return this._sourceArea;
    }

    get targetArea(): Area {
        return this._targetArea;
    }

    get value(): number {
        return this._value;
    }
}