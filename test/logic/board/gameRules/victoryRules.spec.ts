import VictoryRules from '../../../../src/logic/board/gameRules/victoryRules';
import {House} from '../../../../src/logic/board/house';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';
import {GameStoreState} from '../../../../src/logic/board/gameState/gameStoreState';

describe('VictoryRules', () => {

    describe('getVictoryPositionFor', () => {
        it('should count castle and stronghold for given house', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            const state = {
                players: [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])],
                areas: areas
            };
            const actual = VictoryRules.getVictoryPositionFor(state, House.stark);
            expect(actual).toBe(2);
        });
    });

    describe('getWinningHouse', () => {
        it('should return null if no one has 7 strongholds/ castle and gameRound is smaller or equal 10', () => {
            const state: GameStoreState = {gameRound: 0, players: []};
            const actual = VictoryRules.getWinningHouse(state);
            expect(actual).toBeNull();
        });
    });
});