import AreaBuilder from '../../../areaBuilder';
import {UnitType} from '../../../../src/logic/units/unitType';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, recruitUnits} from '../../../../src/logic/board/gameState/actions';
import {GameStoreState} from '../../../../src/logic/board/gameState/gameStoreState';

describe('recruitUnitsAction', () => {

    it('should skip recruiting if no units are provided', () => {
        // given
        const ironThroneSuccession = [House.stark, House.lannister];
        const areasAllowedToRecruit = [AreaKey.Winterfell, AreaKey.WhiteHarbor];
        const areas = new TSMap<AreaKey, Area>();
        const currentHouse = House.stark;
        areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withStronghold().withUnits([UnitType.Horse]).withOrderToken(OrderTokenType.consolidatePower_special).build());
        areas.set(AreaKey.WhiteHarbor, new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withUnits([UnitType.Horse]).build());
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 0);
        currentlyAllowedSupply.set(House.lannister, 0);
        const initialState: GameStoreState = {
            ironThroneSuccession,
            areas,
            areasAllowedToRecruit,
            currentHouse,
            currentlyAllowedSupply
        };
        gameStore.dispatch(loadGame(initialState));
        // when
        gameStore.dispatch(recruitUnits(AreaKey.Winterfell));

        // then
        const newState = gameStore.getState();
        expect(newState).not.toBe(initialState);
        expect(newState.areas).not.toBe(initialState.areas);
        expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.Winterfell).units.length).toBe(1);
        expect(newState.areasAllowedToRecruit).not.toBe(initialState.areasAllowedToRecruit);
        expect(newState.areasAllowedToRecruit.lastIndexOf(AreaKey.Winterfell)).toBe(-1);
    });

    it('should add units provide by action to the area', () => {

        // given
        const ironThroneSuccession = [House.stark, House.lannister];
        const areasAllowedToRecruit = [AreaKey.Winterfell, AreaKey.WhiteHarbor];
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 5);
        currentlyAllowedSupply.set(House.lannister, 5);
        const areas = new TSMap<AreaKey, Area>();
        const currentHouse = House.stark;
        areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withStronghold().withUnits([UnitType.Horse]).withOrderToken(OrderTokenType.consolidatePower_special).build());
        areas.set(AreaKey.WhiteHarbor, new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withUnits([UnitType.Horse]).build());
        const initialState: GameStoreState = {
            ironThroneSuccession,
            areas,
            areasAllowedToRecruit,
            currentHouse,
            currentlyAllowedSupply
        };
        gameStore.dispatch(loadGame(initialState));
        // when
        gameStore.dispatch(recruitUnits(AreaKey.Winterfell, [UnitType.Footman, UnitType.Siege]));

        // then
        const newState = gameStore.getState();
        expect(newState).not.toBe(initialState);
        expect(newState.areas).not.toBe(initialState.areas);
        expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.Winterfell).units.length).toBe(3);
        expect(newState.areasAllowedToRecruit).not.toBe(initialState.areasAllowedToRecruit);
        expect(newState.areasAllowedToRecruit.lastIndexOf(AreaKey.Winterfell)).toBe(-1);

    });

});
