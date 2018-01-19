import {ALL_PHASES, GamePhase} from './gamePhase';
import {House} from './house';
import {AreaKey} from './areaKey';
import {Area} from './area';
import VictoryRules from './gameRules/victoryRules';
import PlayerStateModificationService from './gameState/playerStateModificationService';
import AreaModificationService from './gameState/areaStateModificationService';
import StateSelectorService from './gameRules/stateSelectorService';
import {GameStoreState} from './gameState/gameStoreState';
import GameStateModificationService from './gameState/gameStateModificationService';
import Player from './player';

export default class GamePhaseService {

    public static getNextPhaseAndPlayer(state: GameStoreState, lastSourceAreaKey: AreaKey, updatedAreas: Area[], players: Player[]): GameStoreState {
        const nextGamePhase: GamePhase = this.getNextGamePhaseWithPendingActions(updatedAreas, state.gamePhase, lastSourceAreaKey);


        if (nextGamePhase === GamePhase.ACTION_CLEANUP) {
            const winningHouse = VictoryRules.getWinningHouse(state);
            return {
                areas: AreaModificationService.removeAllRemainingTokens(updatedAreas),
                players: PlayerStateModificationService.executeAllConsolidatePowerOrders(players, updatedAreas),
                gamePhase: GamePhase.WESTEROS1,
                gameRound: state.gameRound + 1,
                winningHouse: winningHouse,
                currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state),
                currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
            };
        }
        let nextHouse = state.ironThroneSuccession[0];
        if (state.gamePhase === nextGamePhase) {
            nextHouse = this.getNextHouseWithPendingActions(state.ironThroneSuccession, state.areas.values(), nextGamePhase, lastSourceAreaKey, this.nextHouse(state.ironThroneSuccession, state.currentHouse));
        }
        return {
            gamePhase: nextGamePhase,
            currentHouse: nextHouse
        };
    }

    public static getNextHouse() {


    }
    public static updateGamePhaseAfterRecruiting(state: GameStoreState, areaKey?: AreaKey) {
        const nextHouseToRecruit = this.getNextHouseToRecruit(state, areaKey);
        return {
            currentHouse: nextHouseToRecruit !== null ? nextHouseToRecruit : state.ironThroneSuccession[0],
            gamePhase: nextHouseToRecruit !== null ? state.gamePhase : this.getNextGamePhase(state.gamePhase),
        };
    }

    public static getNextGamePhase(currentGamePhase: GamePhase): GamePhase {
        const currentIndex = ALL_PHASES.lastIndexOf(currentGamePhase);
        return ALL_PHASES.length === currentIndex ? ALL_PHASES[0] : ALL_PHASES[currentIndex + 1];
    }

    private static isStillIn(areas: Area[], gamePhase: GamePhase, lastModifiedSourceAreaKey: AreaKey, house?: House) {
        switch (gamePhase) {
            case GamePhase.PLANNING:
                return !this.isPlanningPhaseComplete(areas);
            case GamePhase.ACTION_RAID:
                return !this.allRaidOrdersRevealed(areas, house);
            case GamePhase.ACTION_MARCH:
                return !this.allMarchOrdersRevealed(areas, lastModifiedSourceAreaKey, house);
            case GamePhase.ACTION_CLEANUP:
                return areas.filter((area) => {
                    return area.orderToken;
                }).length > 0;
        }
    }

    private static allMarchOrdersRevealed(areas: Area[], lastModifiedSourceAreaKey: AreaKey, house?: House): boolean {
        return areas.filter((area) => {
            return area.key !== lastModifiedSourceAreaKey && area.orderToken && area.orderToken.isMoveToken() && (house === undefined || house === area.controllingHouse);
        }).length === 0;
    }

    private static nextHouse(ironThroneSuccession: House[], house: House): House {
        let currrentIndex = ironThroneSuccession.indexOf(house);
        let nextIndex = ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        return ironThroneSuccession[nextIndex];
    }

    private static allRaidOrdersRevealed(areas: Area[], house?: House): boolean {
        return areas.filter((area) => {
            return area.orderToken && area.orderToken.isRaidToken() && (house === undefined || house === area.controllingHouse);
        }).length === 0;
    }

    private static isAreaWithUnitsAndToken(area): boolean {
        return area.units.length > 0 && area.orderToken != null;
    }

    private static isAreaWithoutUnits(area): boolean {
        return area.units.length === 0;
    }

    private static getNextHouseToRecruit(state: GameStoreState, areaKey: AreaKey) {
        let possibleNextHouse = this.nextHouse(state.ironThroneSuccession, state.currentHouse);
        while (possibleNextHouse !== state.currentHouse) {
            if (this.isAllowedToRecruit(state, possibleNextHouse)) {
                return possibleNextHouse;
            }
            else {
                possibleNextHouse = this.nextHouse(state.ironThroneSuccession, possibleNextHouse);
            }
        }
        if (this.isAllowedToRecruit(state, state.currentHouse, areaKey)) {
            return state.currentHouse;
        }
        return null;
    }

    private static isAllowedToRecruit(state: GameStoreState, house: House, areaKey?: AreaKey) {
        const areasAllowedToRecruit = StateSelectorService.getAreasAllowedToRecruit(state, house).map(area => {
            return area.key;
        });
        const lastIndex = areasAllowedToRecruit.lastIndexOf(areaKey);
        if (lastIndex > 0) {
            areasAllowedToRecruit.slice(lastIndex, 1);
        }
        return areasAllowedToRecruit.length > 0;
    }

    private static isPlanningPhaseComplete(areas: Area[]) {
        const completedAreas = areas.filter((area) => {
            const isAreaWithUnitsAndToken = this.isAreaWithUnitsAndToken(area);
            const isAreaWithoutUnits = this.isAreaWithoutUnits(area);
            return isAreaWithUnitsAndToken || isAreaWithoutUnits;
        }).length;
        return completedAreas === areas.length;

    }

    private static getNextGamePhaseWithPendingActions(areas: Area[], gamePhase: GamePhase, lastModifiedSourceAreaKey: AreaKey): GamePhase {
        const isStillIn = this.isStillIn(areas, gamePhase, lastModifiedSourceAreaKey);
        if (isStillIn) {
            return gamePhase;
        }
        return this.getNextGamePhaseWithPendingActions(areas, this.getNextGamePhase(gamePhase), lastModifiedSourceAreaKey);
    }

    private static getNextHouseWithPendingActions(ironThroneSuccession: House[], areas: Area[], gamePhase: GamePhase, lastSourceAreaKey: AreaKey, house: House) {
        if (this.isStillIn(areas, gamePhase, lastSourceAreaKey, house)) {
            return house;
        }
        const nextHouse = this.nextHouse(ironThroneSuccession, house);
        return this.getNextHouseWithPendingActions(ironThroneSuccession, areas, gamePhase, lastSourceAreaKey, nextHouse);
    }
}