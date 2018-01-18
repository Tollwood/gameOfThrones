import {Area} from './area';
import * as areaConfigData from './areaConfig.json';
import * as unitsConfigData from './unitsConfig.json';
import {House} from './house';
import Unit from '../units/units';
import {UnitType} from '../units/unitType';
import {AreaKey} from './areaKey';
import {TSMap} from 'typescript-map';
import {AreaStats} from './areaStats';

export class AreaInitiator {

    public static getInitalState(playingHouses: Array<House>): TSMap<AreaKey, Area> {
        let areas: TSMap<AreaKey, Area> = new TSMap();
        (<any>unitsConfigData).forEach((jsonConfig) => {
            if (playingHouses.indexOf(House[<string>jsonConfig.controllingHouse]) > -1) {
                const area = this.createArea(jsonConfig);
                areas.set(area.key, area);
            }
        });

        return areas;
    }

    public static getAreaStats(): TSMap<AreaKey, AreaStats> {
        let areasStats: TSMap<AreaKey, AreaStats> = new TSMap();

        (<any>areaConfigData).forEach((jsonConfig) => {
            const areaStats = this.parseAreas(jsonConfig);
            areasStats.set(areaStats.key, areaStats);
        });

        areasStats.values().map(areaStats => {
            this.addBorderAreas(areaStats);
        });
        return areasStats;
    }

    private static parseAreas(json: any): AreaStats {
        return new AreaStats(AreaKey[<string>json.key], json.consolidatePower, json.harbor, json.castle, json.stronghold, json.isLandArea, json.supply);
    }

    private static createArea(json: any) {
        const areaKey: AreaKey = AreaKey[<string>json.key];
        const controllingHouse: House = House[<string>json.controllingHouse];
        const units: Unit[] = [];
        json.units.forEach((unitTypeJson => {
            const unitType: UnitType = UnitType[<string>unitTypeJson];
            const unit = new Unit(unitType, controllingHouse);
            units.push(unit);
        }));
        return new Area(areaKey, controllingHouse, units);
    }

    private static addBorderAreas(areaStats: AreaStats) {
        const jsonConfigArea = (<any>areaConfigData)
            .filter(jsonConfig => {
                return AreaKey[<string>jsonConfig.key] === areaStats.key;
            })[0];
        const borders: AreaKey[] = (<any>jsonConfigArea.borders).map(borderKey => {
            return AreaKey[<string>borderKey];
        });
        areaStats.borders = borders;

    }
}
