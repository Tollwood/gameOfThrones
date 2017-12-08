import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';

describe('SupplyRules', () => {

    const playerStark = new Player(House.stark, 5, []);

    it('should return the size of each army sorted by size', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).build();
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();
        const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();
        const areas = [winterfell, karhold, whiteHarbor];

        // when
        let actual = SupplyRules.getArmiesBySizeForHouse(areas, House.stark);

        // then
        expect(actual).toEqual([4, 3, 2]);

    });

    it('should return 3 if house has one army of size 2 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman])
            .withSupply(1).build();
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentPlayer: playerStark, currentlyAllowedSupply, areas: [karhold]};

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no army and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withSupply(1).build();
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentPlayer: playerStark, currentlyAllowedSupply, areas: [karhold]};

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 2 if house has one army of size 3 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).withSupply(1)
            .build();
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let state = {players: [playerStark], currentPlayer: playerStark, currentlyAllowedSupply, areas: [karhold]};


        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(state);

        // then
        expect(actual).toEqual(2);
    });

    it('should return 3 if house has two armies of size 2 and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).withSupply(1)
            .build();
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman]).build();
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        let gameStoreState = {
            players: [playerStark],
            currentlyAllowedSupply,
            currentPlayer: playerStark,
            areas: [karhold, winterfell]
        };
        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(gameStoreState);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no armyies and supply 1', () => {

        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1)
            .build();
        const currentlyAllowedSupply = new TSMap<House, number>();
        currentlyAllowedSupply.set(House.stark, 1);
        const gameStoreState = {
            ironThroneSuccession: [House.stark],
            players: [playerStark],
            currentPlayer: playerStark,
            currentlyAllowedSupply,
            areas: [karhold]
        };
        SupplyRules.updateSupply(gameStoreState);

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(gameStoreState);

        // then
        expect(actual).toEqual(3);
    });

    it('should return empty array for house with no army', () => {
        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1).build();
        let state = {players: [new Player(House.stark, 5, [])], areas: [karhold]};
        SupplyRules.updateSupply(state);

        expect(SupplyRules.getArmiesBySizeForHouse(state.areas, House.stark)).toEqual([]);


    });

});