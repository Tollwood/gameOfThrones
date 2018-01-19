import AreaBuilder from '../../../areaBuilder';
import {UnitType} from '../../../../src/logic/units/unitType';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, placeOrder} from '../../../../src/logic/board/gameState/actions';
import {OrderToken} from '../../../../src/logic/orderToken/orderToken';
import {GamePhase} from '../../../../src/logic/board/gamePhase';

describe('placeOrderAction', () => {

    it('should place an orderToken', () => {
        // given
        const areas = new TSMap<AreaKey, Area>();
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        const secondArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        areas.set(sourceArea.key, sourceArea);
        areas.set(secondArea.key, secondArea);
        let gameStoreState = {
            areas: areas,
            ironThroneSuccession: [House.stark]
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(placeOrder(sourceArea.key, new OrderToken(House.stark, OrderTokenType.defend_0)));
        const newState = gameStore.getState();

        // then
        expect(newState).not.toBe(gameStoreState);
        const orderToken = newState.areas.get(sourceArea.key).orderToken;
        expect(orderToken).toBeDefined();
        expect(orderToken.getHouse()).toBe(House.stark);
        expect(orderToken.getType()).toBe(OrderTokenType.defend_0);
        expect(newState.currentHouse).toBe(House.stark);

    });

    it('should place an orderToken and switch to next phase if all tokens are placed', () => {
        // given
        const areas = new TSMap<AreaKey, Area>();
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        const secondArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman]).withOrderToken(OrderTokenType.march_zero).build();
        areas.set(sourceArea.key, sourceArea);
        areas.set(secondArea.key, secondArea);
        let gameStoreState = {
            ironThroneSuccession: [House.lannister, House.stark],
            gamePhase: GamePhase.PLANNING,
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(placeOrder(sourceArea.key, new OrderToken(House.stark, OrderTokenType.raid_0)));
        const newState = gameStore.getState();
        // then
        expect(newState).not.toBe(gameStoreState);
        const orderToken = newState.areas.get(sourceArea.key).orderToken;
        expect(orderToken).toBeDefined();
        expect(orderToken.getHouse()).toBe(House.stark);
        expect(orderToken.getType()).toBe(OrderTokenType.raid_0);
        expect(newState.gamePhase).toBe(GamePhase.ACTION_RAID);
        expect(newState.currentHouse).toBe(House.lannister);
    });
});
