import {OrderTokenType} from '../orderToken/orderTokenType';
import {AreaKey} from '../board/areaKey';
export default class PossibleMove {
    private _orderTokenType: OrderTokenType;
    private _sourceAreaKey: AreaKey;
    private _targetAreaKey: AreaKey;
    private _value: number;

    constructor(orderTokenType: OrderTokenType, sourceAreaKey: AreaKey, value: number, targetAreaKey?: AreaKey) {
        this._orderTokenType = orderTokenType;
        this._sourceAreaKey = sourceAreaKey;
        this._targetAreaKey = targetAreaKey;
        this._value = value;
    }


    get orderTokenType(): OrderTokenType {
        return this._orderTokenType;
    }

    get targetAreaKey(): AreaKey {
        return this._targetAreaKey;
    }

    get sourceAreaKey(): AreaKey {
        return this._sourceAreaKey;
    }

    get value(): number {
        return this._value;
    }
}