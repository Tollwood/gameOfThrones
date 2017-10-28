import {Area} from '../area';
export default class AreaRules {

    public static isConnectedArea(source: Area, target: Area) {
        return source.borders.filter((area) => {
                return area.key === target.key;
            }).length === 1;
    }
}