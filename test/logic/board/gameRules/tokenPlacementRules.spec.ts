import {House} from '../../../../src/logic/board/house';
import {OrderToken} from '../../../../src/logic/orderToken/orderToken';
import TokenPlacementRules from '../../../../src/logic/board/gameRules/tokenPlacementRules';
import AreaBuilder from '../../../areaBuilder';
import Player from '../../../../src/logic/board/player';
import GamePhaseService from '../../../../src/logic/board/gamePhaseService';
import {UnitType} from '../../../../src/logic/units/unitType';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, resctrictOrderToken} from '../../../../src/logic/board/gameState/actions';

describe('TokenPlacementRules', () => {

    let playerStark: Player;
    let playerLannister: Player;
    beforeEach(() => {
        playerStark = new Player(House.stark, 0, []);
        playerLannister = new Player(House.lannister, 0, []);
    });

    it('should be allowed to place a token on winterfell', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
        let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);

    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withUnits([UnitType.Footman])
            .withOrderToken(OrderTokenType.consolidatePower_1).build();
        let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    it('should add OrderToken', () => {

        const orderToken: OrderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        const winterfell = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withUnits([UnitType.Footman])
            .build();
        let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
        gameStore.dispatch(loadGame(gameStoreState));
        TokenPlacementRules.addOrderToken(orderToken, AreaKey.Winterfell);
        expect(winterfell.orderToken).toBe(orderToken);

    });

    describe('skipOrder', () => {
        it('should remove orderToken and switch to Next Player', () => {
            const area = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            let gameStoreState = {players: [playerStark, playerLannister], areas: [area]};
            gameStore.dispatch(loadGame(gameStoreState));
            spyOn(GamePhaseService, 'nextPlayer');
            TokenPlacementRules.skipOrder(AreaKey.Winterfell);
            expect(gameStore.getState().areas[0].orderToken).toBeNull();
            expect(GamePhaseService.nextPlayer).toHaveBeenCalled();
        });
    });

    describe('isAllowedToRaid', () => {
        it('should not be allowed if areas are not conntected', () => {
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));
            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });


        it('should not be allowed if target area is not controlled by a house', () => {

            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withBorders([whiteHarbour])
                .withHouse(House.stark)
                .build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));
            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should not be allowed if both areas belong to the same house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .withBorders([whiteHarbour])
                .build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));


            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should not be allowed if land area is raiding a sea area', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .isSeaArea()
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.lannister)
                .withBorders([whiteHarbour])
                .build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));

            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should be allowed if sea area is raiding a land area owned by another house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.raid_0)
                .withHouse(House.lannister)
                .isSeaArea()
                .withBorders([whiteHarbour])
                .build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));


            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeTruthy();
        });

        it('should be allowed if land area is raiding a land area owned by another house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.raid_0)
                .withHouse(House.lannister)
                .withBorders([whiteHarbour])
                .build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell, whiteHarbour]};
            gameStore.dispatch(loadGame(gameStoreState));

            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeTruthy();
        });
    });

    describe('restrictOrderToken', () => {

        it('should reduce the allowed tokens', () => {

            const notAllowedOrderTokenTypes: OrderTokenType[] = [OrderTokenType.consolidatePower_0];
            const state = {currentlyAllowedTokenTypes: [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1]};
            gameStore.dispatch(loadGame(state));
            gameStore.dispatch(resctrictOrderToken(notAllowedOrderTokenTypes));

            expect(gameStore.getState().currentlyAllowedTokenTypes).toEqual([OrderTokenType.consolidatePower_1]);
        });
    });

    describe('executeRaidOrder', () => {
        const sourceArea = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withOrderToken(OrderTokenType.raid_0)
            .build();

        it('should remove orderToken in target and source area', () => {


            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.raid_0)
                .build();
            let gameStoreState = {players: [playerStark, playerLannister], areas: [sourceArea, targetArea]};
            gameStore.dispatch(loadGame(gameStoreState));

            spyOn(GamePhaseService, 'nextPlayer');
            TokenPlacementRules.executeRaidOrder(sourceArea.key, targetArea.key);
            expect(sourceArea.orderToken).toBeNull();
            expect(targetArea.orderToken).toBeNull();
            expect(GamePhaseService.nextPlayer).toHaveBeenCalled();
        });

        it('should increase consolidate power if targetAre contains consolidate Power Token and not reduce target player.powerToken < 0', () => {

            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.consolidatePower_special)
                .build();
            let gameStoreState = {players: [playerStark, playerLannister], areas: [sourceArea, targetArea]};
            gameStore.dispatch(loadGame(gameStoreState));

            spyOn(GamePhaseService, 'nextPlayer');
            TokenPlacementRules.executeRaidOrder(sourceArea.key, targetArea.key);
            expect(GamePhaseService.nextPlayer).toHaveBeenCalled();
            expect(playerLannister.powerToken).toEqual(1);
            expect(playerStark.powerToken).toEqual(0);
        });

        it('should reduce powerToken by one for player owning target area', () => {

            playerStark.powerToken = 5;
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.consolidatePower_special)
                .build();
            let gameStoreState = {players: [playerStark, playerLannister], areas: [sourceArea, targetArea]};
            gameStore.dispatch(loadGame(gameStoreState));

            spyOn(GamePhaseService, 'nextPlayer');
            TokenPlacementRules.executeRaidOrder(sourceArea.key, targetArea.key);
            expect(GamePhaseService.nextPlayer).toHaveBeenCalled();
            expect(playerLannister.powerToken).toEqual(1);
            expect(playerStark.powerToken).toEqual(4);
        });
    });

    describe('getPlacableOrderTokenTypes', () => {
        it('it should return all currentlyAllowedTokenTypes if not order was placed yet', () => {
            // given
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1],
                areas: []
            };
            gameStore.dispatch(loadGame(state));

            // when
            const actual = TokenPlacementRules.getPlacableOrderTokenTypes(House.stark);
            // then
            expect(actual).toEqual(gameStore.getState().currentlyAllowedTokenTypes);
        });

        it('it should return all currentlyAllowedTokenTypes minus the once already placed', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.defend_0, OrderTokenType.consolidatePower_1],
                areas: [winterfell]
            };
            gameStore.dispatch(loadGame(state));

            // when
            const actual = TokenPlacementRules.getPlacableOrderTokenTypes(House.stark);
            // then
            expect(actual).toEqual([OrderTokenType.defend_0]);
        });

    });

    describe('consolidateAllPower', () => {
        it('should increase power for all player owning areas with consolidate power symbols', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).build();
            const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withConsolidatePower(2).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withConsolidatePower(1).build();

            let gameStoreState = {
                players: [playerStark, playerLannister],
                areas: [winterfell, castleBlack, whiteHarbor]
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            TokenPlacementRules.consolidateAllPower();

            // then
            expect(playerStark.powerToken).toBe(3);
            expect(playerLannister.powerToken).toBe(1);
        });
    });

    describe('executeAllConsolidatePowerOrders', () => {
        it('should increase power for all player owning areas with consolidate power symbols and give one additional power for each token', () => {

            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).withOrderToken(OrderTokenType.consolidatePower_1).build();
            const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withConsolidatePower(2).withOrderToken(OrderTokenType.consolidatePower_0).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withConsolidatePower(1).withOrderToken(OrderTokenType.consolidatePower_special).build();
            let gameStoreState = {
                players: [playerStark, playerLannister],
                areas: [winterfell, castleBlack, whiteHarbor]
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            TokenPlacementRules.executeAllConsolidatePowerOrders();

            // then
            expect(playerStark.powerToken).toBe(5);
            expect(winterfell.orderToken).toBeNull();
            expect(castleBlack.orderToken).toBeNull();
            expect(whiteHarbor.orderToken).toBeNull();
            expect(playerLannister.powerToken).toBe(2);
        });

        it('should not increase power if no consolidate power token exist in area', () => {

            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).withOrderToken(OrderTokenType.raid_0).build();

            let gameStoreState = {players: [playerStark, playerLannister], areas: [winterfell]};
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            TokenPlacementRules.executeAllConsolidatePowerOrders();

            // then
            expect(playerStark.powerToken).toBe(0);
        });
    });

});