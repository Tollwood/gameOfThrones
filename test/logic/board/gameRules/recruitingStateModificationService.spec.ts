import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import RecruitingStateModificationService from '../../../../src/logic/board/gameState/recruitingStateModificationService';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';
import StateSelectorService from '../../../../src/logic/board/gameRules/stateSelectorService';

describe('RecruitingStateModificationService', () => {
    describe('calculateAreasAllowedToRecruit', () => {
        it('should set all areas controlled by a  house that has a stronghold and enough supply', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            const theStonyShore = new AreaBuilder(AreaKey.TheStonyShore).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.TheStonyShore, theStonyShore);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {areas: areas, currentHouse: House.stark};

            spyOn(StateSelectorService, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingStateModificationService.calculateAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0]).toEqual(AreaKey.Winterfell);
            expect(StateSelectorService.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state, state.currentHouse);
        });
    });
});