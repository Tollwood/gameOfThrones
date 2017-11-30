import {ACTION_PHASES, GamePhase, WESTEROS_PHASES} from './gamePhase';
import {House} from './house';
import GameRules from './gameRules/gameRules';
import {gameStore} from './gameState/reducer';
import {incrementGameRound, nextPhase} from './gameState/actions';

export default class GamePhaseService {

    public static isStillIn(gamePhase: GamePhase) {
        switch (gamePhase) {
            case GamePhase.ACTION_RAID:
                return !this.allRaidOrdersRevealed();
            case GamePhase.ACTION_MARCH:
                return !this.allMarchOrdersRevealed();
            case GamePhase.ACTION_CONSOLIDATE_POWER:
                return !this.allConsolidatePowerOrdersRevealed();
            case GamePhase.ACTION_CLEANUP:
                return GameRules.gameState.areas.filter((area) => {
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
        return GameRules.gameState.areas.filter((area) => {
                return area.orderToken && area.orderToken.isMoveToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    public static allRaidOrdersRevealed(house?: House): boolean {
        return GameRules.gameState.areas.filter((area) => {
                return area.orderToken && area.orderToken.isRaidToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    private static allConsolidatePowerOrdersRevealed(): boolean {
        return GameRules.gameState.areas.filter((area) => {
                return area.orderToken && area.orderToken.isConsolidatePowerToken();
            }).length === 0;
    }

    static allOrderTokenPlaced(house?: House): boolean {
        return GameRules.gameState.areas.filter((area) => {
                return area.units.length > 0 && (house === undefined || area.controllingHouse === house) && area.orderToken === null;
            }).length === 0;
    }


    // this method is used from everywhere can we improve this?
    public static nextPlayer() {
        let gamestate = GameRules.gameState;
        let currrentIndex = gamestate.ironThroneSuccession.indexOf(gamestate.currentPlayer.house);
        let nextIndex = gamestate.ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        let nextHouse: House = gamestate.ironThroneSuccession[nextIndex];

        gamestate.currentPlayer = GameRules.getPlayerByHouse(nextHouse);
    }

    public static switchToNextPhase() {
        let gameState = GameRules.gameState;
        gameStore.dispatch(nextPhase());
        gameState.currentPlayer = GameRules.getFirstFromIronThroneSuccession();
    }

}