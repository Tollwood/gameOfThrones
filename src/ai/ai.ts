import Player from '../board/logic/player';
import GameState from '../board/logic/gameStati';
import GameRules from '../board/logic/gameRules';
import {OrderToken, OrderTokenType} from '../orderToken/logic/orderToken';
import {Area} from '../board/logic/area';
import {House} from '../board/logic/house';
export default class AI {

    public static placeAllOrderTokens(player: Player) {
        if (player.computerOpponent) {

            let availableOrderToken = GameRules.getAvailableOrderToken(player.house);
            let areasToPlaceAToken = GameState.getInstance().areas.filter((area) => {
                return area.units.length > 0 && area.units[0].getHouse() === player.house && area.orderToken === null;
            });
            for (let area of areasToPlaceAToken) {
                GameRules.addOrderToken(new OrderToken(player.house, availableOrderToken.pop()), area.key);
            }
        }
    }


    public static executeMoveOrder(player: Player) {

        let areasWithMoveToken = this.getAreasWithToken(player, [OrderTokenType.march_special, OrderTokenType.march_zero, OrderTokenType.march_minusOne]);

        if (areasWithMoveToken.length > 0) {
            let sourceArea = areasWithMoveToken[0];
            let areasToMoveTo = sourceArea.borders.filter((targetArea) => {
                return sourceArea.units.length > 0 && GameRules.isAllowedToMove(sourceArea, targetArea, sourceArea.units[0]);
            });
            if (areasToMoveTo.length > 0) {
                GameRules.moveUnits(sourceArea.key, areasToMoveTo[0].key, sourceArea.units);
                // GameRules.executeConsolidatePowerOrder(sourceArea.key);
                return;
            }
            else {
                GameRules.skipOrder(sourceArea.key);
                return;
            }
        }

    }

    private static getAreasWithToken(player: Player, orderTokens: Array<OrderTokenType>): Array<Area> {
        return GameState.getInstance().areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === player.house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    public static recruit(areas: Area[]){
        let computerPlayer: House[] = GameState.getInstance().players.filter((p)=>{ return p.computerOpponent}).map((p)=>{return p.house});
        areas.filter((a)=>{
            return computerPlayer.indexOf(a.controllingHouse) > -1;
        }).forEach((area)=>{
            GameRules.recruit(area);
        });
    }
}