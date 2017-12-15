import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import RecruitingRules from '../../../../src/logic/board/gameRules/recruitingRules';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import {Area} from '../../../../src/logic/board/area';
import {TSMap} from 'typescript-map';

describe('RecruitingRules', () => {
    describe('calculateAreasAllowedToRecruit', () => {
        it('should set all areas controlled by a  house that has a stronghold and enough supply', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {areas: areas};

            spyOn(SupplyRules, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingRules.calculateAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0]).toEqual(AreaKey.Winterfell);
            expect(SupplyRules.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
        });
    });
});