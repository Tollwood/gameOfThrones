import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import StateSelectorService from '../../../../src/logic/board/gameRules/stateSelectorService';
import SupplyStateModificationService from '../../../../src/logic/board/gameState/supplyStateModificationService';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';

describe('StateSelectorService', () => {

    const playerLannister = new Player(House.lannister, 0, []);
    const playerStark = new Player(House.stark, 1, []);

    describe('getAllAreasAllowedToMarchTo', () => {

        it('should return empty Array if no units are present in sourceArea', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            const actual = StateSelectorService.getAllAreasAllowedToMarchTo(state, sourceArea);
            expect(actual.length).toBe(0);
        });

        it('should return no valid areas if source area has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withBorders([]).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            const actual = StateSelectorService.getAllAreasAllowedToMarchTo(state, area);
            // then
            expect(actual.length).toBe(0);
        });
        it('should be allowed to move units from one area to an unoccupied border area', () => {
            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([karhold])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Karhold, karhold);
            areas.set(AreaKey.Winterfell, winterfell);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, winterfell);

            // then
            expect(StateSelectorService.enoughSupplyForArmySize).toHaveBeenCalledWith(state, winterfell, karhold);
            expect(result.length).toBe(1);
            expect(result.indexOf(karhold)).toBeGreaterThan(-1);
        });

        it('should be allowed to move land units from WhiteHarbor via theShiveringsea using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea()
                .build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([theSiveringSea])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            areas.set(AreaKey.TheShiveringSea, theSiveringSea);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(StateSelectorService.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should be allowed to move land units from WhiteHarbor via two sea areas using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea().build();

            let theStonyShore = new AreaBuilder(AreaKey.TheStonyShore).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([theSiveringSea])
                .isSeaArea()
                .build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark).withUnits([UnitType.Footman])
                .withBorders([theStonyShore])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            areas.set(AreaKey.TheShiveringSea, theSiveringSea);
            areas.set(AreaKey.TheStonyShore, theStonyShore);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(StateSelectorService.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);

        });
        it('should be allowed to move unit into an enemy area with establish control of other player', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(StateSelectorService.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should be allowed to move units into an occupied area', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon)
                .withUnits([UnitType.Footman]).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman]).withBorders([castleBlack]).withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should not move land unit into a sea area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).isSeaArea().build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(StateSelectorService, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBe(-1);
        });
        it('should not move sea unit into a land area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .isSeaArea().build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            const currentlyAllowedSupply = new TSMap<House, number>();
            currentlyAllowedSupply.set(House.stark, 1);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas,
                currentlyAllowedSupply
            };
            // when
            let result = StateSelectorService.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBe(-1);

        });
    });

    describe('getAreasAllowedToRecruit', () => {
        it('should return all areas allowed for recruiting that belong to the given house and army is smaller than maxAllowedArmy', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {
                currentHouse: House.stark,
                areas: areas,
                areasAllowedToRecruit: [AreaKey.Winterfell, AreaKey.WhiteHarbor]
            };
            spyOn(StateSelectorService, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = StateSelectorService.getAreasAllowedToRecruit(state, House.stark);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0].key).toBe(AreaKey.Winterfell);
            expect(StateSelectorService.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state, state.currentHouse);
        });

        it('should not consider areas which exceed the supply limit', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Horse]).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {
                currentHouse: House.stark,
                areas: areas,
                areasAllowedToRecruit: [AreaKey.Winterfell, AreaKey.WhiteHarbor]
            };

            spyOn(StateSelectorService, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(1);
            // when
            const actual = StateSelectorService.getAreasAllowedToRecruit(state, House.stark);

            // then
            expect(StateSelectorService.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state, state.currentHouse);
            expect(actual.length).toBe(0);
        });
    });

    describe('calculateAllowedMaxSizeBasedOnSupply', () => {
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
            let actual = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);

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
            let actual = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);

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
            let actual = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);

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
            let actual = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(gameStoreState, gameStoreState.currentHouse);

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
            SupplyStateModificationService.updateSupply(gameStoreState);

            // when
            let actual = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(gameStoreState, gameStoreState.currentHouse);

            // then
            expect(actual).toEqual(3);
        });

        it('should return the size of each army sorted by size', () => {

            // given
            const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).build();
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman, UnitType.Footman]).build();

            const areas = [winterfell, karhold, whiteHarbor];

            // when
            let actual = StateSelectorService.calculateArmiesBySizeForHouse(areas, House.stark);

            // then
            expect(actual).toEqual([4, 3, 2]);

        });
    });
});


