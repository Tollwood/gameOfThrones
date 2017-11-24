import {Area} from './area';
import * as areaConfigData from './areaConfig.json';
import * as unitsConfigData from './unitsConfig.json';
import {House} from './house';
import Unit from '../units/units';
import {UnitType} from '../units/unitType';
import {AreaKey} from './areaKey';

export class AreaInitiator {

    public static getInitalState(playingHouses: Array<House>): Array<Area> {
        let areas: Array<Area> = [];

        (<any>areaConfigData).forEach((jsonConfig) => {
            areas.push(this.parseAreas(jsonConfig));
        });

        areas.map(area => {
            this.addBorderAreas(area, areas);
        });

        (<any>unitsConfigData).forEach((jsonConfig) => {
            areas.filter(area => {
                return AreaKey[<string>jsonConfig.key] === area.key && playingHouses.indexOf(House[<string>jsonConfig.controllingHouse]) > -1;
            }).map(area => {
                this.updateArea(area, jsonConfig);
            });
        });

        return areas;
    }

    private static parseAreas(json: any): Area {
        return new Area(AreaKey[<string>json.key], json.consolidatePower, json.harbor, json.castle, json.stronghold, json.isLandArea, json.supply);
    }

    private static updateArea(area: Area, json: any) {
        area.controllingHouse = House[<string>json.controllingHouse];
        area.units = [];
        json.units.forEach((unitTypeJson => {
            const unitType: UnitType = UnitType[<string>unitTypeJson];
            const unit = new Unit(unitType, area.controllingHouse);
            area.units.push(unit);
        }));
    }

    private static addBorderAreas(area: Area, areas: Area[]) {
        const jsonConfigArea = (<any>areaConfigData)
            .filter(jsonConfig => {
                return AreaKey[<string>jsonConfig.key] === area.key;
            })[0];
        const borders: Area[] = (<any>jsonConfigArea.borders).map(borderKey => {
            const matchinArea = areas.filter(potenialBorder => {
                return potenialBorder.key === AreaKey[<string>borderKey];
            })[0];
            return matchinArea;
        });
        area.borders = borders;

    }
}
