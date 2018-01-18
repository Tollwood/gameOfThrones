import {WesterosCard} from '../src/logic/cards/westerosCard';
import {GamePhase} from '../src/logic/board/gamePhase';

export default class WesterosCardBuilder {
    private _gamePhase: GamePhase;

    public gamePhase(gamePhase: GamePhase): WesterosCardBuilder {
        this._gamePhase = gamePhase;
        return this;
    }

    public build(): WesterosCard {
        return new WesterosCard(null, null, null, null, this._gamePhase, null, null);

    }
}