import {House} from '../house';
import {Area} from '../area';
import {AreaKey} from '../areaKey';
import {GameStoreState} from '../gameState/gameStoreState';
import {AreaStatsService} from '../AreaStatsService';

export default class VictoryRules {

    public static getVictoryPositionFor(state: GameStoreState, house: House) {
        return state.areas.values().filter((area: Area) => {
            return area.controllingHouse === house && AreaStatsService.getInstance().areaStats.get(area.key).hasCastleOrStronghold();
        }).length;
    }

    public static getWinningHouse(state: GameStoreState): House {
        let winningHouse: House = null;
        const nextGameRound = state.gameRound + 1;
        if (nextGameRound > 10) {
            let sortedPlayersByVictoryPoints = state.players.sort((a, b) => {
                return VictoryRules.getVictoryPositionFor(state, b.house) - VictoryRules.getVictoryPositionFor(state, a.house);
            });
            winningHouse = sortedPlayersByVictoryPoints[0].house;
        }
        return winningHouse;
    }

    public static verifyWinningHouseAfterMove(state: GameStoreState, house: House, targetAreaKey?: AreaKey): House {
        let winningHouse: House = null;
        const player = state.players.filter((player) => {
            return player.house === house;
        })[0];
        if (this.getVictoryPositionFor(state, player.house) === 6 && AreaStatsService.getInstance().areaStats.get(targetAreaKey).hasCastleOrStronghold()) {
            winningHouse = player.house;
        }
        return winningHouse;
    }
}