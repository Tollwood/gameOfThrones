import {WesterosCard} from '../../cards/westerosCard';
export default class GameState {

    private _currentWesterosCard: WesterosCard = null;
    private _westerosCards1 = [];
    private _westerosCards2 = [];
    private _westerosCards3 = [];
    get westerosCards3(): Array<WesterosCard> {
        return this._westerosCards3;
    }

    get westerosCards2(): Array<WesterosCard> {
        return this._westerosCards2;
    }

    get westerosCards1(): Array<WesterosCard> {
        return this._westerosCards1;
    }

    get currentWesterosCard(): WesterosCard {
        return this._currentWesterosCard;
    }

    set westerosCards3(value: Array<WesterosCard>) {
        this._westerosCards3 = value;
    }

    set westerosCards2(value: Array<WesterosCard>) {
        this._westerosCards2 = value;
    }

    set westerosCards1(value: Array<WesterosCard>) {
        this._westerosCards1 = value;
    }

    set currentWesterosCard(value: WesterosCard) {
        this._currentWesterosCard = value;
    }

}