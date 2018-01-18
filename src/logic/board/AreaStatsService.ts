import {TSMap} from 'typescript-map';
import {AreaKey} from './areaKey';
import {AreaStats} from './areaStats';
import {AreaInitiator} from './areaInitiator';

export class AreaStatsService {
    private static areaStatsService: AreaStatsService;

    private constructor() {
        this._areaStats = AreaInitiator.getAreaStats();
    }

    private _areaStats: TSMap<AreaKey, AreaStats>;

    get areaStats(): TSMap<AreaKey, AreaStats> {
        return this._areaStats;
    }

    public static getInstance() {
        if (!this.areaStatsService) {
            return this.areaStatsService = new AreaStatsService();
        }
        return this.areaStatsService;
    }
}