import {Area} from "./area";
import {GameState} from "./gameStati";
import {House} from "./house";
import {OrderToken} from "./orderToken";
import {isUndefined} from "util";
export class GameRules {

    public isAllowedToPlaceOrderToken(house: House, areaKey: string): boolean {
        const area = this.getAreaByKey(areaKey);
        return area.getUnits().length > 0
            && area.getUnits()[0].getHouse() === house
            && area.getOrderToken() === undefined;
    }

    public addOrderToken(ordertoken: OrderToken, areaKey: string) {
        const area = this.getAreaByKey(areaKey);
        area.setOrderToken(ordertoken);
    }

    private getAreaByKey(areaKey: string): Area {
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
        gameState.areas.map((area) => {
            area.setOrderToken(undefined);
        });
    }
}