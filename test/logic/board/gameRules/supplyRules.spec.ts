import {House} from '../../../../src/logic/board/house';
import SupplyStateModificationService from '../../../../src/logic/board/gameState/supplyStateModificationService';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import StateSelectorService from '../../../../src/logic/board/gameRules/stateSelectorService';

describe('SupplyStateModificationService', () => {


    it('should return empty array for house with no army', () => {
        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1).build();
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        let state = {players: [new Player(House.stark, 5, [])], areas: areas};
        SupplyStateModificationService.updateSupply(state);

        expect(StateSelectorService.calculateArmiesBySizeForHouse(state.areas.values(), House.stark)).toEqual([]);


    });

});