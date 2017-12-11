import {House} from '../house';
import {Area} from '../area';
import {gameStore} from '../gameState/reducer';
export default class VictoryRules {

    public static getVictoryPositionFor(house: House) {
        return gameStore.getState().areas.values().filter((area: Area) => {
            return area.controllingHouse === house && area.hasCastleOrStronghold();
        }).length;
    }


    public static getWinningHouse(): House {
        let winningHouse: House = null;

        gameStore.getState().players.forEach((player) => {
            if (this.getVictoryPositionFor(player.house) === 7) {
                winningHouse = player.house;
            }
        });
        return winningHouse;
    }
}