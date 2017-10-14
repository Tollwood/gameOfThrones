import {ACTION_PHASES, GamePhase, WESTEROS_PHASES} from './gamePhase';
import GameState from './gameStati';
import {House} from './house';
import GameRules from './gameRules';

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
                return GameState.getInstance().areas.filter((area) => {
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

    public static planningCompleteForCurrentPlayer() {
        return this.allOrderTokenPlaced(GameState.getInstance().currentPlayer.house);
    }

    public static isPlanningPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.PLANNING && this.allOrderTokenPlaced();
    }

    public static allMarchOrdersRevealed(house?: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken && area.orderToken.isMoveToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    public static allRaidOrdersRevealed(house?: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken && area.orderToken.isRaidToken() && (house === undefined || house === area.controllingHouse);
            }).length === 0;
    }

    private static allConsolidatePowerOrdersRevealed(): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken && area.orderToken.isConsolidatePowerToken();
            }).length === 0;
    }

    private static allOrderTokenPlaced(house?: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.units.length > 0 && (house === undefined || area.controllingHouse === house) && area.orderToken === null;
            }).length === 0;
    }


    public static nextRound() {
        const gameState = GameState.getInstance();
        gameState.gamePhase = GamePhase.WESTEROS1;
        gameState.areas.map((area) => {
            area.orderToken = null;
        });
        gameState.nextRound();
        gameState.currentlyAllowedTokenTypes = GameRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
        gameState.currentPlayer = gameState.getFirstFromIronThroneSuccession();
    }


    // this method is used from everywhere can we improve this?
    public static nextPlayer() {
        let gamestate = GameState.getInstance();
        let currrentIndex = gamestate.ironThroneSuccession.indexOf(gamestate.currentPlayer.house);
        let nextIndex = gamestate.ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        let nextHouse = gamestate.ironThroneSuccession[nextIndex];
        gamestate.currentPlayer = gamestate.players.filter((player) => {
            return player.house === nextHouse;
        })[0];
    }

    public static switchToNextPhase() {
        let gameState = GameState.getInstance();
        if (gameState.gamePhase === GamePhase.ACTION_CLEANUP) {
            this.nextRound();
        } else {
            gameState.gamePhase++;
        }
        gameState.currentPlayer = gameState.getFirstFromIronThroneSuccession();
    }

}