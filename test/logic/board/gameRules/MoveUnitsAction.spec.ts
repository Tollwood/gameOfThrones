import AreaBuilder from '../../../areaBuilder';
import Unit from '../../../../src/logic/units/units';
import {UnitType} from '../../../../src/logic/units/unitType';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, moveUnits} from '../../../../src/logic/board/gameState/actions';
import Player from '../../../../src/logic/board/player';

describe('moveUnits', () => {
    const playerLannister = new Player(House.lannister, 0, []);
    const playerStark = new Player(House.stark, 1, []);

    it('should move the units and establish control in targetArea, aswell as moving on to the next player', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const footmanUnit1 = new Unit(UnitType.Footman, House.stark);
        const footmanUnit2 = new Unit(UnitType.Footman, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit, footmanUnit1, footmanUnit2];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [footmanUnit1, horseUnit];
        const completeOrder = false;
        const establishControl = false;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameStore.getState().areas;

        // then
        expect(actual).not.toBe(areas);

        expect(actual.get(targetArea.key).units).toEqual(unitsToMove);
        expect(actual.get(targetArea.key).controllingHouse).toBe(House.stark);
        expect(actual.get(sourceArea.key).units).toEqual([footmanUnit2]);
        expect(actual.get(sourceArea.key).controllingHouse).toBe(House.stark);
        expect(actual.get(sourceArea.key).orderToken).toBeDefined();
        expect(actual.get(sourceArea.key).orderToken.getType()).toBeDefined(OrderTokenType.march_special);
        expect(gameStore.getState().currentHouse).toBe(House.lannister);
    });
    it('should set controllingHouse to null if all units leave source area', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit];
        const completeOrder = false;
        const establishControl = false;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameStore.getState().areas;
        // then
        expect(actual.get(sourceArea.key).controllingHouse).toBeNull();
    });
    it('should set the orderToken to null incase order is complete', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit];
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(moveUnits(sourceArea.key, targetArea.key, unitsToMove));
        const actual = gameStore.getState().areas;
        // then
        expect(actual.get(sourceArea.key).orderToken).toBeNull();
    });
    it('should establish control if order is complete and establishControl is true', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit];
        const completeOrder = true;
        const establishControl = true;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameStore.getState();

        // then
        expect(actual.areas.get(sourceArea.key).controllingHouse).toBe(House.stark);
        expect(gameStore.getState().players.filter(player => player.house === House.stark)[0].powerToken).toBe(0);
    });
});
