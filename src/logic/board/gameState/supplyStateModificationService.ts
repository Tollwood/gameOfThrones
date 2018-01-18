import {House} from '../house';
import {TSMap} from 'typescript-map';
import {Area} from '../area';
import {GameStoreState} from './gameStoreState';
import {AreaStatsService} from '../AreaStatsService';

export default class SupplyStateModificationService {

    public static updateSupply(state: GameStoreState): TSMap<House, number> {
        let updatedSupply = new TSMap<House, number>();
        state.players.forEach((player) => {
            updatedSupply.set(player.house, this.calculateNumberOfSupply(state.areas.values(), player.house));
        });
        return updatedSupply;
    }

    private static calculateNumberOfSupply(areas: Area[], house: House): number {
        return areas.filter((area: Area) => {
            const areaStats = AreaStatsService.getInstance().areaStats.get(area.key);
            return area.controllingHouse === house && areaStats.supply > 0;
        }).map((area) => {
            const areaStats = AreaStatsService.getInstance().areaStats.get(area.key);
            return areaStats.supply;
        }).reduce(
            (accumulator,
             currentValue) => {
                return accumulator + currentValue;
            }, 0
        );
    }

}