import {Area} from '../area';
import {TSMap} from 'typescript-map';
import {AreaKey} from '../areaKey';
export default class AreaRules {

    public static isConnectedArea(source: Area, target: Area): boolean {
        return source.borders.filter((area) => {
                return area.key === target.key;
            }).length === 1;
    }

    public static removeAllRemainingTokens(areas: Area[]): TSMap<AreaKey, Area> {
        const newAreasMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const copyOfArea = area.copy();
            copyOfArea.orderToken = null;
            newAreasMap.set(copyOfArea.key, copyOfArea);

        });
        return newAreasMap;
    }
}