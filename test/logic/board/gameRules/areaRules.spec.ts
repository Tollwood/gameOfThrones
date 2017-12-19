import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, skipOrder} from '../../../../src/logic/board/gameState/actions';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {House} from '../../../../src/logic/board/house';
import GamePhaseService from '../../../../src/logic/board/gamePhaseService';

describe('AreaStateModificationService', () => {

    describe('skipOrder', () => {
        it('should remove orderToken and switch to Next Player', () => {

            const area = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            let gameStoreState = {areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));
            spyOn(GamePhaseService, 'nextHouse');

            gameStore.dispatch(skipOrder(AreaKey.Winterfell));

            const newAreas = gameStore.getState().areas;
            expect(newAreas.get(AreaKey.Winterfell).orderToken).toBeNull();
            expect(GamePhaseService.nextHouse).toHaveBeenCalled();
        });
    });

});