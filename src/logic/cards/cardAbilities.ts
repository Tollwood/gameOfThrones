import {OrderTokenType} from '../orderToken/orderTokenType';
import PlayerStateModificationService from '../board/gameState/playerStateModificationService';
import SupplyStateModificationService from '../board/gameState/supplyStateModificationService';
import RecruitingStateModificationService from '../board/gameState/recruitingStateModificationService';
import GamePhaseService from '../board/gamePhaseService';
import CardFactory from './cardFactory';
import {GameStoreState} from '../board/gameState/gameStoreState';

export default class CardAbilities {

    public static shuffleCards(state: GameStoreState) {
        let cards = state.westerosCards.get(state.currentWesterosCard.gamePhase).slice();
        CardFactory.shuffle(cards);

        const newState = {
            ...state,
            currentWesterosCard: null,
        };
        newState.westerosCards.set(state.currentWesterosCard.gamePhase, cards);
        return newState;
    }

    public static supply(state: GameStoreState) {
        return {
            ...state,
            currentlyAllowedSupply: SupplyStateModificationService.updateSupply(state),
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static recruit(state: GameStoreState) {
        const stateWithUnitsAllowedToRecruit = {
            ...state,
            areasAllowedToRecruit: RecruitingStateModificationService.calculateAreasAllowedToRecruit(state),
        };
        return {
            ...stateWithUnitsAllowedToRecruit,
            ...GamePhaseService.updateGamePhaseAfterRecruiting(stateWithUnitsAllowedToRecruit),
        };
    }

    public static nothing(state: GameStoreState) {
        return {
            ...state,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static invluence(state: GameStoreState) {
        return {
            ...state,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static power(state: GameStoreState) {
        return {
            ...state,
            players: PlayerStateModificationService.consolidateAllPower(state),
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noDefenseOrders(state: GameStoreState) {
        const restrictedTokenTypes = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noSpecialMarchOrder(state: GameStoreState) {
        const restrictedTokenTypes = [OrderTokenType.march_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noRaidOrders(state: GameStoreState) {
        const restrictedTokenTypes = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noConsolidatePowerOrders(state: GameStoreState) {
        const restrictedTokenTypes = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noSupportOrders(state: GameStoreState): GameStoreState {
        const restrictedTokenTypes = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static wildlingAttack(state: GameStoreState): GameStoreState {
        return {
            ...state,
            currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }
}