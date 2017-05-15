import Player from './player';
import GameState from './gameStati';
import GameRules from './gameRules';
import {OrderToken} from './orderToken';
import {isUndefined} from 'util';
import {Area} from './area';
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


    public static executeMoveOrder(area: Area){

        let areasToMoveTo= area.borders.filter((targetArea => {
            return area.units.length > 0 && GameRules.isAllowedToMove(area,targetArea, area.units[0]) && area.units[0].getHouse() !== GameState.getInstance().currentPlayer;}));

        if(areasToMoveTo.length > 0){
            GameRules.moveUnits(area.key,areasToMoveTo[0].key, area.units[0]);
        }
        else if(area.units.length > 0 && area.units[0].getHouse() !== GameState.getInstance().currentPlayer ){
            GameRules.skipMarchorder(area.key);
        }
    }
}