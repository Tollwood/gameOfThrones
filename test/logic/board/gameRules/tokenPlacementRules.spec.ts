import {House} from '../../../../src/logic/board/house';
import TokenPlacementRules from '../../../../src/logic/board/gameRules/tokenPlacementRules';
import AreaBuilder from '../../../areaBuilder';
import Player from '../../../../src/logic/board/player';
import {UnitType} from '../../../../src/logic/units/unitType';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {executeRaidOrder, loadGame} from '../../../../src/logic/board/gameState/actions';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';

xdescribe('TokenPlacementRules', () => {

    let playerStark: Player;
    let playerLannister: Player;
    beforeEach(() => {
        playerStark = new Player(House.stark, 0);
        playerLannister = new Player(House.lannister, 0);
    });

    it('should be allowed to place a token on winterfell', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);

    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withUnits([UnitType.Footman])
            .withOrderToken(OrderTokenType.consolidatePower_1).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        const actual = TokenPlacementRules.isAllowedToPlaceOrderToken(House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    describe('isAllowedToRaid', () => {
        it('should not be allowed if areas are not conntected', () => {
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);
            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
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
                .withHouse(House.stark)
                .build();

            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
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
                .build();

            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));


            const actual = TokenPlacementRules.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should not be allowed if land area is raiding a sea area', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.lannister)
                .build();

            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
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
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
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
                .build();

            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
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

            expect(gameStore.getState().currentlyAllowedTokenTypes).toEqual([OrderTokenType.consolidatePower_1]);
        });
    });

    describe('raidPowerToken', () => {
        const sourceArea = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withOrderToken(OrderTokenType.raid_0)
            .build();

        it('should remove orderToken in target and source area', () => {


            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.raid_0)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));

            gameStore.dispatch(executeRaidOrder(sourceArea.key, targetArea.key));
            const newState = gameStore.getState();
            expect(newState).not.toBe(gameStoreState);
            expect(newState.areas.get(sourceArea.key)).not.toBe(sourceArea);
            expect(newState.areas.get(sourceArea.key).orderToken).toBeNull();
            expect(newState.areas.get(targetArea.key)).not.toBe(targetArea);
            expect(newState.areas.get(targetArea.key).orderToken).toBeNull();
        });

        it('should increase consolidate power if targetAre contains consolidate Power Token and not reduce target player.powerToken < 0', () => {

            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.consolidatePower_special)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));
            gameStore.dispatch(executeRaidOrder(sourceArea.key, targetArea.key));
            const newState = gameStore.getState();
            expect(newState).not.toBe(gameStoreState);

            expect(playerLannister.powerToken).toEqual(1);
            expect(playerStark.powerToken).toEqual(0);
        });

        it('should reduce powerToken by one for player owning target area', () => {

            playerStark.powerToken = 5;
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withOrderToken(OrderTokenType.consolidatePower_special)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));

            gameStore.dispatch(executeRaidOrder(sourceArea.key, targetArea.key));
            expect(playerLannister.powerToken).toEqual(1);
            expect(playerStark.powerToken).toEqual(4);
        });
    });

    describe('getPlacableOrderTokenTypes', () => {
        it('it should return all currentlyAllowedTokenTypes if not order was placed yet', () => {
            // given
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1],
                areas: new TSMap<AreaKey, Area>()
            };
            gameStore.dispatch(loadGame(state));

            // when
            const actual = TokenPlacementRules.getPlacableOrderTokenTypes(state, House.stark);
            // then
            expect(actual).toEqual(gameStore.getState().currentlyAllowedTokenTypes);
        });

        it('it should return all currentlyAllowedTokenTypes minus the once already placed', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.defend_0, OrderTokenType.consolidatePower_1],
                areas: areas
            };
            gameStore.dispatch(loadGame(state));

            // when
            const actual = TokenPlacementRules.getPlacableOrderTokenTypes(state, House.stark);
            // then
            expect(actual).toEqual([OrderTokenType.defend_0]);
        });

    });

    describe('isConnectedArea', () => {

        it('should return the true for adjacent areas', () => {

            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.Karhold, karhold);
            let gameStoreState = {areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            let actual = TokenPlacementRules.isConnectedArea(winterfell, karhold);

            // then
            expect(actual).toBeTruthy();

        });

        it('should return the false for non adjacent areas', () => {

            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.Karhold, karhold);
            let gameStoreState = {areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));
            // when
            let actual = TokenPlacementRules.isConnectedArea(karhold, winterfell);

            // then
            expect(actual).toBeFalsy();

        });

    });

});