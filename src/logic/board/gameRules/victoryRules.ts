import {House} from '../house';
import {Area} from '../area';
import {GameStoreState} from '../gameState/reducer';
import {AreaKey} from '../areaKey';
export default class VictoryRules {

    public static getVictoryPositionFor(state: GameStoreState, house: House) {
        return state.areas.values().filter((area: Area) => {
            return area.controllingHouse === house && area.hasCastleOrStronghold();
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
        if (this.getVictoryPositionFor(state, player.house) === 6 && state.areas.get(targetAreaKey).hasCastleOrStronghold()) {
            winningHouse = player.house;
        }
        return winningHouse;
    }
}