import CardAbilities from '../../../src/logic/cards/cardAbilities';
import SupplyStateModificationService from '../../../src/logic/board/gameState/supplyStateModificationService';
import {OrderTokenType} from '../../../src/logic/orderToken/orderTokenType';
import {gameStore} from '../../../src/logic/board/gameState/reducer';
import {executeWesterosCard, newGame} from '../../../src/logic/board/gameState/actions';
import {WesterosCard} from '../../../src/logic/cards/westerosCard';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {House} from '../../../src/logic/board/house';
import Player from '../../../src/logic/board/player';
import {Area} from '../../../src/logic/board/area';
import AreaBuilder from '../../areaBuilder';

describe('CardAbilities', () => {

    describe('supply', () => {
        it(' should call updateSuppy', () => {
            const state = {};
            spyOn(SupplyStateModificationService, 'updateSupply');
            CardAbilities.supply(state);
            expect(SupplyStateModificationService.updateSupply).toHaveBeenCalled();
        });
    });

    describe('invluence', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.invluence(null);
        });
    });

    describe('nothing', () => {
        it(' should do nothing for now', () => {
            CardAbilities.nothing(null);
        });
    });

    describe('recruit', () => {
        it(' should set all areas allowed to recruit', () => {
            const card: WesterosCard = null;
            spyOn(gameStore, 'dispatch');
            CardAbilities.recruit(null);
            expect(gameStore.dispatch).toHaveBeenCalledWith(executeWesterosCard(card));
        });
    });

    describe('shuffleCards', () => {
        it(' should do nothing for now', () => {
            CardAbilities.shuffleCards(null);
        });
    });

    describe('noConsolidatePowerOrders', () => {
        it(' should remove consolidate power Orders from currentlyAllowedTokenTypes', () => {
            // given
            gameStore.dispatch(newGame([]));
            // when
            CardAbilities.noConsolidatePowerOrders(null);
            const state = gameStore.getState();
            // then
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_0)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_1)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_special)).toBe(-1);
        });
    });

    describe('noRaidOrders', () => {
        it(' should do nothing for now', () => {
            // given
            gameStore.dispatch(newGame([]));
            // when
            CardAbilities.noRaidOrders(null);
            const state = gameStore.getState();
            // then
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_0)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_1)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_special)).toBe(-1);

        });
    });

    describe('noSpecialMarchOrder', () => {
        it(' should remove march special Order from currentlyAllowedTokenTypes', () => {
            gameStore.dispatch(newGame([]));
            CardAbilities.noSpecialMarchOrder(null);
            const state = gameStore.getState();
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.march_special)).toBe(-1);
        });
    });

    describe('noDefenseOrders', () => {
        it('should remove defense Orders from currentlyAllowedTokenTypes', () => {
            gameStore.dispatch(newGame([]));
            CardAbilities.noDefenseOrders(null);
            const state = gameStore.getState();
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_1)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_0)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_special)).toBe(-1);
        });
    });
    describe('power', () => {
        it('should increase power for all player owning areas with consolidate power symbols', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).build();
            const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withConsolidatePower(2).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withConsolidatePower(1).build();

            const playerStark = new Player(House.stark, 0, []);
            const playerLannister = new Player(House.lannister, 0, []);

            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.CastleBlack, castleBlack);
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            let gameStoreState = {
                players: [playerStark, playerLannister],
                areas: areas
            };

            // when
            CardAbilities.power(gameStoreState);
            const newState = gameStore.getState();
            const newPlayerStark = newState.players.filter(player => player.house === House.stark)[0];
            const newPlayerLannister = newState.players.filter(player => player.house === House.lannister)[0];
            // then
            expect(newPlayerStark).not.toBe(playerStark);
            expect(newPlayerStark.powerToken).toBe(3);
            expect(newPlayerLannister).not.toBe(playerLannister);
            expect(newPlayerLannister.powerToken).toBe(1);
        });
    });

    describe('wildlingAttack', () => {
        it(' should do nothing for now', () => {
            CardAbilities.wildlingAttack(null);
        });
    });

    describe('noSupportOrders', () => {
        it(' should remove the support token for currently allowedOrderTokenTypes', () => {
            gameStore.dispatch(newGame([]));
            CardAbilities.noSupportOrders(null);
            const state = gameStore.getState();
            expect(state.currentlyAllowedTokenTypes.length).toBe(12);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_0)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_1)).toBe(-1);
            expect(state.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_special)).toBe(-1);
        });
    });
});