import AreaRules from '../../../../src/logic/board/gameRules/AreaRules';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame} from '../../../../src/logic/board/gameState/actions';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';

describe('AreaRules', () => {

    it('should return the true for adjacent areas', () => {

        // given
        let karhold = new AreaBuilder(AreaKey.Karhold).build();
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withBorders([karhold]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.Karhold, karhold);
        let gameStoreState = {areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        // then
        expect(actual).toBeTruthy();

    });

    it('should return the false for non adjacent areas', () => {

        // given
        let karhold = new AreaBuilder(AreaKey.Karhold).build();
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withBorders([karhold]).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.Karhold, karhold);
        let gameStoreState = {areas: areas};
        gameStore.dispatch(loadGame(gameStoreState));
        // when
        let actual = AreaRules.isConnectedArea( karhold, winterfell);

        // then
        expect(actual).toBeFalsy();

    });

});