import {Area} from '../area';
import {TSMap} from 'typescript-map';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
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

    public static addOrderToken(areas: Area[], ordertoken: OrderToken, areaKey: AreaKey): TSMap<AreaKey, Area> {
        const newAreaMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (newArea.key === areaKey) {
                newArea.orderToken = ordertoken;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }


    public static removeOrderTokens(areas: Area[], areaKeys: AreaKey[]): TSMap<AreaKey, Area> {
        const newAreaMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (areaKeys.lastIndexOf(newArea.key) > -1) {
                newArea.orderToken = null;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }

    public static removeOrderToken(areas: Area[], areaKey: AreaKey): TSMap<AreaKey, Area> {
        return this.addOrderToken(areas, null, areaKey);
    }
}