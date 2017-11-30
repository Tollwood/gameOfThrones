import {House} from '../house';
import {Area} from '../area';
import GameRules from './gameRules';
export default class VictoryRules {

    public static getVictoryPositionFor(house: House) {
        return GameRules.gameState.areas.filter((area: Area) => {
            return area.controllingHouse === house && area.hasCastleOrStronghold();
        }).length;
    }


    public static getWinningHouse(): House {
        let winningHouse: House = null;
        let gamestate = GameRules.gameState;
        gamestate.players.forEach((player) => {
            if (this.getVictoryPositionFor(player.house) === 7) {
                winningHouse = player.house;
            }
        });
        return winningHouse;
    }
}