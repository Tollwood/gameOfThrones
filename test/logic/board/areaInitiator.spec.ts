import {AreaInitiator} from '../../../src/logic/board/areaInitiator';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {House} from '../../../src/logic/board/house';
import {Area} from '../../../src/logic/board/area';
import {UnitType} from '../../../src/logic/units/unitType';
import {TSMap} from 'typescript-map';
import {AreaStats} from '../../../src/logic/board/areaStats';

describe('AreaInitiator', () => {
    describe('getInitalState', () => {

        it('should load json file and parse areas', () => {
            const actual: TSMap<AreaKey, AreaStats> = AreaInitiator.getAreaStats();
            const areaKeys = getAreaKeys();
            expect(actual.length).toEqual(areaKeys.length);

            const undefinedKeys = filterUndefinedKeys(actual.keys());
            expect(undefinedKeys.length).toBe(0);
            const kingsLanding = actual.get(AreaKey.KingsLanding);
            expect(kingsLanding.borders.length).toBe(5);
            expect(kingsLanding.consolidatePower).toBe(2);
            expect(kingsLanding.castle).toBeFalsy();
            expect(kingsLanding.stronghold).toBeTruthy();
            expect(kingsLanding.isLandArea).toBeTruthy();
            expect(kingsLanding.supply).toBe(0);
        });

        it('should add units and controllingHouse for playing Houses', () => {
            const actual: TSMap<AreaKey, Area> = AreaInitiator.getInitalState([House.stark]);
            const theShiveringSea = actual.get(AreaKey.TheShiveringSea);
            expect(theShiveringSea.controllingHouse).toBe(House.stark);
            expect(theShiveringSea.units.length).toBe(1);
            expect(theShiveringSea.units[0].getType()).toBe(UnitType.Ship);
        });
    });
});

function getAreaKeys(): string[] {
    const objValues = Object.keys(AreaKey).map(k => AreaKey[k]);
    return objValues.filter(v => typeof v === 'string') as string[];
}

function filterUndefinedKeys(areaKeys: AreaKey[]): AreaKey[] {
    return areaKeys.filter((knownKey) => {
        return getAreaKeys().indexOf(knownKey) === -1;
    });
}