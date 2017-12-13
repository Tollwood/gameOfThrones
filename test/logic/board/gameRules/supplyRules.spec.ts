import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';

describe('SupplyRules', () => {

    const playerStark = new Player(House.stark, 5, []);

    it('should return the size of each army sorted by size', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).build();
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();
        const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();

        const areas = [winterfell, karhold, whiteHarbor];

        // when
        let actual = SupplyRules.calculateArmiesBySizeForHouse(areas, House.stark);

        // then
        expect(actual).toEqual([4, 3, 2]);

    });

    it('should return 3 if house has one army of size 2 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman])
            .withSupply(1).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentHouse: House.stark, currentlyAllowedSupply, areas: areas};

        // when
        let actual = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no army and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withSupply(1).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentHouse: House.stark, currentlyAllowedSupply, areas: areas};

        // when
        let actual = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 2 if house has one army of size 3 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).withSupply(1)
            .build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentHouse: House.stark, currentlyAllowedSupply, areas: areas};


        // when
        let actual = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(2);
    });

    it('should return 3 if house has two armies of size 2 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).withSupply(1)
            .build();
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman]).build();

        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.Karhold, karhold);
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let gameStoreState = {
            players: [playerStark],
            currentlyAllowedSupply,
            currentHouse: House.stark,
            areas: areas
        };
        // when
        let actual = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(gameStoreState);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no armyies and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1)
            .build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        const gameStoreState = {
            ironThroneSuccession: [House.stark],
            players: [playerStark],
            currentHouse: House.stark,
            currentlyAllowedSupply,
            areas: areas
        };
        SupplyRules.updateSupply(gameStoreState);

        // when
        let actual = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(gameStoreState);

        // then
        expect(actual).toEqual(3);
    });

    it('should return empty array for house with no army', () => {
        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        let state = {players: [new Player(House.stark, 5, [])], areas: areas};
        SupplyRules.updateSupply(state);

        expect(SupplyRules.calculateArmiesBySizeForHouse(state.areas.values(), House.stark)).toEqual([]);


    });

});