import Player from './player';
import GameState from './gameStati';
import GameRules from './gameRules';
import {OrderToken, OrderTokenType} from './orderToken';
import {isUndefined} from 'util';
export default class AI {

    public  static placeOrderTokens (){
        let aiPlayers: Array<Player> = GameState.getInstance().players.filter((player) => { return player.computerOpponent});
        for( let aiPlayer of aiPlayers){
            let availableOrderToken = GameRules.getAvailableOrderToken(aiPlayer.house);
            let areasToPlaceAToken = GameState.getInstance().areas.filter((area) => { return area.units.length > 0 && area.units[0].getHouse() === aiPlayer.house && isUndefined(area.orderToken)});
            for(let area of areasToPlaceAToken){
                GameRules.addOrderToken(new OrderToken(aiPlayer.house, availableOrderToken.pop()), area.key);
            }
        }
    }


    public static executeMoveOrder(player: Player) {

        let areasWithMoveToken = GameState.getInstance().areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === player.house
                && [OrderTokenType.march_special, OrderTokenType.march_zero, OrderTokenType.march_minusOne].indexOf(area.orderToken.getType()) > -1;
        });

        if (areasWithMoveToken.length > 0) {
            let sourceArea = areasWithMoveToken[0];
            let areasToMoveTo = sourceArea.borders.filter((targetArea) => {
                return sourceArea.units.length > 0 && GameRules.isAllowedToMove(sourceArea, targetArea, sourceArea.units[0])
            });
            if (areasToMoveTo.length > 0) {
                GameRules.moveUnits(sourceArea.key, areasToMoveTo[0].key, sourceArea.units[0]);
            }
            else {
                GameRules.skipMarchorder(sourceArea.key);
            }
        }
    }
}