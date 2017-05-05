import {Area} from './area';
import GameState from './gameStati';
import {House} from './house';
import {OrderToken} from './orderToken';
import {isUndefined} from 'util';
export default class GameRules {

    public static isAllowedToPlaceOrderToken(house: House, areaKey: string): boolean {
        const area = this.getAreaByKey(areaKey);
        return !isUndefined(area) && area.getUnits().length > 0
            && area.getUnits()[0].getHouse() === house
            && area.getOrderToken() === undefined;
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: string) {
        const area = this.getAreaByKey(areaKey);
        area.setOrderToken(ordertoken);
    }

    private static  getAreaByKey(areaKey: string): Area {
        return GameState.getInstance().areas.filter((area: Area) => {
            return area.getKey() === areaKey;
        })[0];
    }

    public static allOrderTokenPlaced(): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.getUnits().length > 0 && isUndefined(area.getOrderToken());
            }).length === 0;
    }

    public static nextRound() {
        const gameState = GameState.getInstance();
        gameState.nextRound();
        gameState.gamePhase = gameState.gamePhase + 1;
    }

    private resetOrderToken() {
        GameState.getInstance().areas.map((area) => {
            area.setOrderToken(undefined);
        });
    }
}