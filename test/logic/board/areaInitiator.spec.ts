import {AreaInitiator} from '../../../src/logic/board/areaInitiator';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {House} from '../../../src/logic/board/house';
import {Area} from '../../../src/logic/board/area';
import {UnitType} from '../../../src/logic/units/unitType';
describe('AreaInitiator', () => {
    describe('getInitalState', () => {

        it('should load json file and parse areas', () => {
            const actual = AreaInitiator.getInitalState([]);
            const areaKeys = getAreaKeys();
            expect(actual.length).toEqual(areaKeys.length);

            const undefinedKeys = filterUndefinedKeys(actual);
            expect(undefinedKeys.length).toBe(0);
            const kingsLanding = findByKey(actual, AreaKey.KingsLanding);
            expect(kingsLanding.borders.length).toBe(5);
            expect(kingsLanding.consolidatePower).toBe(2);
            expect(kingsLanding.castle).toBeFalsy();
            expect(kingsLanding.stronghold).toBeTruthy();
            expect(kingsLanding.isLandArea).toBeTruthy();
            expect(kingsLanding.supply).toBe(0);
        });

        it('should add units and controllingHouse for playing Houses', () => {
            const actual = AreaInitiator.getInitalState([House.stark]);
            const theShiveringSea = findByKey(actual, AreaKey.TheShiveringSea);
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

function filterUndefinedKeys(areas: Area[]): AreaKey[] {
    return areas.filter((area) => {
        const areaKey: string = AreaKey[area.key];
        return getAreaKeys().indexOf(areaKey) === -1;
    }).map(area => area.key);
}

function findByKey(areas: Area[], key: AreaKey) {
    return areas.filter((area) => {
        return area.key === key;
    })[0];
}