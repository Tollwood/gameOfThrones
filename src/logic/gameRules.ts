import {Area, AreaKey} from './area';
import GameState from './gameStati';
import {House} from './house';
import {OrderToken} from './orderToken';
import {isUndefined} from 'util';
import {GamePhase} from './gamePhase';
import {Unit} from './units';
export default class GameRules {

    public static isAllowedToPlaceOrderToken(house: House, areaKey: string): boolean {
        const area = this.getAreaByKey(areaKey);
        return !isUndefined(area) && area.units.length > 0
            && area.units[0].getHouse() === house
            && area.orderToken === undefined;
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: string) {
        const area = this.getAreaByKey(areaKey);
        area.orderToken = ordertoken;
    }

    private static  getAreaByKey(areaKey: string): Area {
        return GameState.getInstance().areas.filter((area: Area) => {
            return area.key === areaKey;
        })[0];
    }

    public static allOrderTokenPlaced(currentPlayer: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.units.length > 0 && area.units[0].getHouse() === currentPlayer && isUndefined(area.orderToken);
            }).length === 0;
    }

    public static nextRound() {
        const gameState = GameState.getInstance();
        gameState.nextRound();
    }

    public static switchToPhase(phase: GamePhase) {
        GameState.getInstance().gamePhase = phase;
    }
    private resetOrderToken() {
        GameState.getInstance().areas.map((area) => {
            area.orderToken = undefined;
        });
    }

    public static moveUnits(source: AreaKey, target: AreaKey) {
        let sourceArea = this.getAreaByKey(source);
        sourceArea.orderToken = undefined;
        let targetArea = this.getAreaByKey(target);
        targetArea.units = targetArea.units.concat(sourceArea.units);
        sourceArea.units = new Array<Unit>();

    }

    private getAreaByKey(areaKey: AreaKey): Area {
        return GameState.getInstance().areas.filter((area) => {
            return area.key === areaKey
        })[0];
    }

    public static isPlanningPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.PLANNING && this.allOrderTokenPlaced(GameState.getInstance().currentPlayer)
    }

    public static isActionPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.ACTION && this.allOrderTokenRevealed(GameState.getInstance().currentPlayer)
    }

    private static allOrderTokenRevealed(currentPlayer: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken && area.orderToken.getHouse() === currentPlayer;
            }).length === 0;
    }
}