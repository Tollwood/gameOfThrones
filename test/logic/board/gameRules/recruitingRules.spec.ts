import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import RecruitingRules from '../../../../src/logic/board/gameRules/recruitingRules';
import {UnitType} from '../../../../src/logic/units/unitType';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';

describe('RecruitingRules', () => {
    describe('addUnitsToArea', () => {
        it('should add the provided units to a copy of the given area', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            const unitTypes = [UnitType.Horse, UnitType.Footman];
            // when
            const actual = RecruitingRules.addUnitsToArea(area, unitTypes);

            //then
            expect(actual).not.toBe(area);
            expect(actual.units.length).toBe(2);
        });

        it('should add the provided units to a copy of the given area', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Siege]).build();
            const unitTypes = [UnitType.Horse, UnitType.Footman];
            // when
            const actual = RecruitingRules.addUnitsToArea(area, unitTypes);

            //then
            expect(actual).not.toBe(area);
            expect(actual.units.length).toBe(3);
        });
    });
    describe('updateAreasAllowedToRecruit', () => {
        it('should return a new object with the updated areas allowed to recruit', () => {
            // given
            const areasAllowedToRecruit = [AreaKey.Winterfell, AreaKey.TheTwins];
            const areaKey = AreaKey.Winterfell;
            // when
            const actual = RecruitingRules.updateAreasAllowedToRecruit(areasAllowedToRecruit, areaKey);
            // then
            expect(actual).not.toBe(areasAllowedToRecruit);
            expect(actual.length).toBe(1);
            expect(actual[0]).toBe(AreaKey.TheTwins);
        });
    });

    describe('calculateAreasAllowedToRecruit', () => {
        it('should set all areas controlled by a  house that has a stronghold and enough supply', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {areas: areas};

            spyOn(SupplyRules, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingRules.calculateAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0]).toEqual(AreaKey.Winterfell);
            expect(SupplyRules.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
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
            spyOn(SupplyRules, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingRules.getAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0].key).toBe(AreaKey.Winterfell);
            expect(SupplyRules.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
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

            spyOn(SupplyRules, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(1);
            // when
            const actual = RecruitingRules.getAreasAllowedToRecruit(state);

            // then
            expect(SupplyRules.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
            expect(actual.length).toBe(0);
        });
    });
});