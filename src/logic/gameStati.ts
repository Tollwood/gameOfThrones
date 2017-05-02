import {Area} from "./area";
import {AreaInitiator} from "./initialArea";
export class GameState {

    private static gameState: GameState;


    private constructor() {

    }

    private round: number = 1;
    private areas: Array<Area> = new Array<Area>();

    public static getInstance(): GameState {
        if (!this.gameState) {
            this.gameState = new GameState();
            this.gameState.areas = AreaInitiator.getInitalState();
        }
        return this.gameState;
    }

    public getCurrentRound() {
        return this.round;
    }

    public nextRound(): void {
        this.round++;
    }

    public getAreas(): Array<Area> {
        return this.areas;
    }
}