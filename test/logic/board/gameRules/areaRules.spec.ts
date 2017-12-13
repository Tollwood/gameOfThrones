import AreaRules from '../../../../src/logic/board/gameRules/AreaRules';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, placeOrder, skipOrder} from '../../../../src/logic/board/gameState/actions';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';
import {OrderToken} from '../../../../src/logic/orderToken/orderToken';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import GamePhaseService from '../../../../src/logic/board/gamePhaseService';

describe('AreaRules', () => {

    it('should return the true for adjacent areas', () => {

        // given
        let karhold = new AreaBuilder(AreaKey.Karhold).build();
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withBorders([karhold]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.Karhold, karhold);
        let gameStoreState = {areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        // then
        expect(actual).toBeTruthy();

    });

    it('should return the false for non adjacent areas', () => {

        // given
        let karhold = new AreaBuilder(AreaKey.Karhold).build();
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withBorders([karhold]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.Karhold, karhold);
        let gameStoreState = {areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        // when
        let actual = AreaRules.isConnectedArea( karhold, winterfell);

        // then
        expect(actual).toBeFalsy();

    });

    it('should add OrderToken', () => {

        const orderToken: OrderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        const winterfell = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withUnits([UnitType.Footman])
            .build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        gameStore.dispatch(placeOrder(winterfell.key, orderToken));
        const actual = gameStore.getState();
        expect(actual.areas).not.toBe(areas);
        expect(gameStore.getState().areas.get(AreaKey.Winterfell).orderToken).toBe(orderToken);

    });

    describe('skipOrder', () => {
        it('should remove orderToken and switch to Next Player', () => {

            const area = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            let gameStoreState = {areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));
            spyOn(GamePhaseService, 'nextHouse');

            gameStore.dispatch(skipOrder(AreaKey.Winterfell));

            const newAreas = gameStore.getState().areas;
            expect(newAreas.get(AreaKey.Winterfell).orderToken).toBeNull();
            expect(GamePhaseService.nextHouse).toHaveBeenCalled();
        });
    });

});