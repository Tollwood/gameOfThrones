import {Area} from './area';
import {AreaInitiator} from './initialArea';
import {GamePhase} from './gamePhase';
export default class GameState {

    private static gameState: GameState;
    private _gamePhase: GamePhase = GamePhase.PLANNING;
    private _round: number = 1;
    private _areas: Array<Area> = new Array<Area>();

    public static getInstance(): GameState {
        if (!this.gameState) {
            this.gameState = new GameState();
            this.gameState._areas = AreaInitiator.getInitalState();
        }
        return this.gameState;
    }

    public nextRound(): void {
        this._round++;
    }

    get gamePhase(): GamePhase {
        return this._gamePhase;
    }

    set gamePhase(value: GamePhase) {
        this._gamePhase = value;
    }

    get areas(): Array<Area> {
        return this._areas;
    }

    set areas(value: Array<Area>) {
        this._areas = value;
    }

    get round(): number {
        return this._round;
    }

}