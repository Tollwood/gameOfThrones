import {OrderTokenType} from '../orderToken/orderTokenType';
import {GameStoreState} from '../board/gameState/reducer';
import PlayerStateModificationService from '../board/gameState/playerStateModificationService';
import SupplyStateModificationService from '../board/gameState/supplyStateModificationService';
import RecruitingStateModificationService from '../board/gameState/recruitingStateModificationService';
import GamePhaseService from '../board/gamePhaseService';
import CardFactory from './cardFactory';

export default class CardAbilities {

    public static shuffleCards(state: GameStoreState) {
        let westerosCards1 = state.westerosCards1.slice();
        let westerosCards2 = state.westerosCards2.slice();
        let westerosCards3 = state.westerosCards3.slice();
        if (state.currentWesterosCard.cardType === 1) {
            CardFactory.shuffle(westerosCards1);
        }
        if (state.currentWesterosCard.cardType === 2) {
            CardFactory.shuffle(westerosCards2);
        }
        if (state.currentWesterosCard.cardType === 3) {
            CardFactory.shuffle(westerosCards3);
        }
        return {
            ...state,
            currentWesterosCard: null,
            westerosCards1,
            westerosCards2,
            westerosCards3,

        };
    }

    public static supply(state: GameStoreState) {
        return {
            ...state,
            currentlyAllowedSupply: SupplyStateModificationService.updateSupply(state),
            currentWesterosCard: null,
            gamePhase: state.gamePhase + 1
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
            gamePhase: state.gamePhase + 1
        };
    }

    public static invluence(state: GameStoreState) {
        console.log('invluence');
        return {
            ...state,
            currentWesterosCard: null,
            gamePhase: state.gamePhase + 1
        };
    }

    public static power(state: GameStoreState) {
        return {
            ...state,
            players: PlayerStateModificationService.consolidateAllPower(state),
            currentWesterosCard: null,
            gamePhase: state.gamePhase + 1,
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
            gamePhase: state.gamePhase + 1,
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
            gamePhase: state.gamePhase + 1,
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
            gamePhase: state.gamePhase + 1,
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
            gamePhase: state.gamePhase + 1,
        };
    }

    public static noSupportOrders(state: GameStoreState) {
        const restrictedTokenTypes = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
            currentWesterosCard: null,
            gamePhase: state.gamePhase + 1
        };
    }

    public static wildlingAttack(state: GameStoreState): GameStoreState {
        console.log('wildlingAttack');
        return {
            ...state,
            currentWesterosCard: null,
            gamePhase: state.gamePhase + 1
        };
    }
}