import {AreaKey} from '../areaKey';
import Player from '../player';
import {House} from '../house';
import {GameStoreState} from './gameStoreState';
import PlayerSetup from '../playerSetup';
import CardFactory from '../../cards/cardFactory';
import AiPlayer from '../../ai/aiPlayer';
import {Area} from '../area';
import {AreaStatsService} from '../AreaStatsService';

export default class PlayerStateModificationService {
    private static INITIAL_POWER_TOKEN: number = 5;
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
                    additionalPower += AreaStatsService.getInstance().areaStats.get(area.key).consolidatePower;
                }
            });
            const newPlayer = player.copy();
            newPlayer.powerToken += additionalPower;
            newPlayers.push(newPlayer);
        });
        // Add logic for ships in harbour
        return newPlayers;
    }


    public static executeAllConsolidatePowerOrders(players: Player[], areas: Area[]): Player[] {
        const updatedPlayers: Player[] = players.slice(0);
        areas.filter((area) => {
            return area.orderToken && area.orderToken.isConsolidatePowerToken();
        }).map((area) => {
            area.orderToken = null;
            let additionalPowerToken = AreaStatsService.getInstance().areaStats.get(area.key).consolidatePower + 1;
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

    public static initPlayers(playerSetup: Array<PlayerSetup>): Player[] {
        const players: Player[] = [];
        playerSetup.forEach((config) => {
            if (config.ai) {
                players.push(new AiPlayer(config.house, this.INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
            }
            else {
                players.push(new Player(config.house, this.INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
            }
        });
        return players;
    }
}