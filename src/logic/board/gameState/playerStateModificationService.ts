import {GameStoreState} from './reducer';
import {AreaKey} from '../areaKey';
import Player from '../player';
import {House} from '../house';
export default class PlayerStateModificationService {

    public static raidPowerToken(state: GameStoreState, source: AreaKey, target: AreaKey): Player[] {

        const targetArea = state.areas.get(target);
        const sourceArea = state.areas.get(source);
        if (targetArea.orderToken.isConsolidatePowerToken()) {
            const newPlayers = state.players.slice(0);
            newPlayers.filter((player) => {
                return player.house === targetArea.controllingHouse;
            }).map((player) => {
                if (player.powerToken > 0) {
                    player.powerToken--;
                }
            });
            newPlayers.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0].powerToken++;

            return newPlayers;
        }
        return state.players;
    }

    public static establishControl(players: Player[], establishControl: boolean, house: House): Player[] {
        if (establishControl) {
            const newPlayers = players.slice(0);
            newPlayers.filter((player) => {
                return player.house === house;
            })[0].powerToken--;
            return newPlayers;
        }
        return players;
    }

    public static consolidateAllPower(state: GameStoreState): Player[] {
        const newPlayers = [];
        state.players.forEach((player) => {
            let additionalPower = 0;
            state.areas.values().forEach((area) => {
                if (area.controllingHouse === player.house) {
                    additionalPower += area.consolidatePower;
                }
            });
            const newPlayer = player.copy();
            newPlayer.powerToken += additionalPower;
            newPlayers.push(newPlayer);
        });
        // Add logic for ships in harbour
        return newPlayers;
    }


    public static executeAllConsolidatePowerOrders(state: GameStoreState): Player[] {
        const updatedPlayers: Player[] = state.players.slice(0);
        state.areas.values().filter((area) => {
            return area.orderToken && area.orderToken.isConsolidatePowerToken();
        }).map((area) => {
            area.orderToken = null;
            let additionalPowerToken = area.consolidatePower + 1;
            let player = updatedPlayers.filter((player) => {
                return player.house === area.controllingHouse;
            })[0];
            const indexOfPlayer = updatedPlayers.lastIndexOf(player);
            const newPlayer = player.copy();
            newPlayer.powerToken += additionalPowerToken;
            updatedPlayers[indexOfPlayer] = newPlayer;
        });
        return updatedPlayers;
    }
}