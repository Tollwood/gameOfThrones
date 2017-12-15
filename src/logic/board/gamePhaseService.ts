import {ACTION_PHASES, GamePhase, WESTEROS_PHASES} from './gamePhase';
import {House} from './house';
import {gameStore, GameStoreState} from './gameState/reducer';
import {nextPhase} from './gameState/actions';

export default class GamePhaseService {

    public static isStillIn(gamePhase: GamePhase) {
        switch (gamePhase) {
            case GamePhase.ACTION_RAID:
                return !this.allRaidOrdersRevealed();
            case GamePhase.ACTION_MARCH:
                return !this.allMarchOrdersRevealed();
            case GamePhase.ACTION_CLEANUP:
                // TODO make state immutable
                return gameStore.getState().areas.values().filter((area) => {
                        return area.orderToken;
                    }).length > 0;
        }
    }

    public static isActionPhase(gamePhase: GamePhase) {
        return ACTION_PHASES.indexOf(gamePhase) > -1;
    }

    public static isWesterosPhase(gamePhase: GamePhase) {
        return WESTEROS_PHASES.indexOf(gamePhase) > -1;
    }

    public static allMarchOrdersRevealed(house?: House): boolean {
        return gameStore.getState().areas.values().filter((area) => {
                return area.orderToken && area.orderToken.isMoveToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    public static allRaidOrdersRevealed(house?: House): boolean {
        return gameStore.getState().areas.values().filter((area) => {
                return area.orderToken && area.orderToken.isRaidToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    static allOrderTokenPlaced(house?: House): boolean {
        return gameStore.getState().areas.values().filter((area) => {
                return area.units.length > 0 && (house === undefined || area.controllingHouse === house) && area.orderToken === null;
            }).length === 0;
    }

    public static nextHouse(state: GameStoreState): House {

        let currrentIndex = state.ironThroneSuccession.indexOf(state.currentHouse);
        let nextIndex = state.ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        return state.ironThroneSuccession[nextIndex];
    }

    public static switchToNextPhase() {
        gameStore.dispatch(nextPhase());
    }

}