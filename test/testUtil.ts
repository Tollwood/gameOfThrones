import GameState from '../src/board/logic/gameState/GameState';
import {Area, AreaKey} from '../src/board/logic/area';
import {House} from '../src/board/logic/house';
import {UnitType} from '../src/units/logic/unitType';
import {OrderToken, OrderTokenType} from '../src/orderToken/logic/orderToken';
import Unit from '../src/units/logic/units';
export default class TestUtil {

    public static defineArea(gameState: GameState, key: AreaKey, house: House, units: UnitType[] = [], borders: Area[], orderTokenType: OrderTokenType, isLandArea: boolean = true, supply: number = 0) {
        let area = new Area(key, 0, false, false, false, isLandArea, supply, house);
        units.forEach((type) => {
            area.units.push(new Unit(type, house));
        });
        area.borders = borders;
        area.orderToken = new OrderToken(house, orderTokenType);
        gameState.areas.push(area);
        return area;
    }
}