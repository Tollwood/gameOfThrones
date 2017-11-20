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
        if (gamestate.round > 10) {
            let sortedPlayersByVictoryPoints = gamestate.players.sort((a, b) => {
                return this.getVictoryPositionFor(b.house) - this.getVictoryPositionFor(a.house);
            });
            winningHouse = sortedPlayersByVictoryPoints[0].house;
        }
        return winningHouse;
    }
}