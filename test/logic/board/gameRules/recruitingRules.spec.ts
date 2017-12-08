import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import RecruitingRules from '../../../../src/logic/board/gameRules/recruitingRules';
import {UnitType} from '../../../../src/logic/units/unitType';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame} from '../../../../src/logic/board/gameState/actions';
import Player from '../../../../src/logic/board/player';

describe('RecruitingRules', () => {
    const playerStark = new Player(House.stark, 5, []);
    describe('recruit', () => {
        it('should add recruited units to area and remove from eligble areas', () => {
            // given
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            let gameStoreState = {areas: [winterfell], areasAllowedToRecruit: [winterfell]};
            gameStore.dispatch(loadGame(gameStoreState));
            // when
            RecruitingRules.recruit(gameStoreState, winterfell, [UnitType.Footman]);

            // then
            expect(winterfell.units.length).toBe(1);
            expect(winterfell.units[0].getType()).toBe(UnitType.Footman);
            expect(gameStore.getState().areasAllowedToRecruit.length).toBe(0);
        });
        it('should skip recruiting if no units provided', () => {
            // given
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            let state = {areas: [winterfell], areasAllowedToRecruit: [winterfell]};
            // when
            RecruitingRules.recruit(state, winterfell);

            // then
            expect(winterfell.units.length).toBe(0);
        });
        it('should throw error if area is not eligble for recruiting', () => {
            // given
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            let state = {areas: [winterfell], areasAllowedToRecruit: []};

            // when
            const functionToCall = () => {
                RecruitingRules.recruit(state, winterfell, [UnitType.Footman]);
            };
            // then
            expect(functionToCall).toThrow(new Error('Area is not eligible for recruiting'));

        });
    });

    describe('setAreasAllowedToRecruit', () => {
        it('should set all areas controlled by a  house that has a stronghold and enough supply', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withCastle().build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).build();
            let state = {areas: [winterfell, whiteHarbor]};

            spyOn(SupplyRules, 'allowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingRules.setAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0].key).toEqual(AreaKey.Winterfell);
            expect(SupplyRules.allowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
        });
    });

    describe('getAreasAllowedToRecruit', () => {
        it('should return all areas allowd for recruiting that belong to the given house and army is smaller than maxAllowedArmy', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).build();
            let state = {
                currentPlayer: playerStark,
                areas: [winterfell, whiteHarbor],
                areasAllowedToRecruit: [winterfell, whiteHarbor]
            };
            spyOn(SupplyRules, 'allowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingRules.getAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0].key).toBe(AreaKey.Winterfell);
            expect(SupplyRules.allowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
        });

        it('should not consider areas which exceed the supply limit', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Horse]).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).build();
            let state = {
                currentPlayer: playerStark,
                areas: [winterfell, whiteHarbor],
                areasAllowedToRecruit: [winterfell, whiteHarbor]
            };

            spyOn(SupplyRules, 'allowedMaxSizeBasedOnSupply').and.returnValue(1);
            // when
            const actual = RecruitingRules.getAreasAllowedToRecruit(state);

            // then
            expect(SupplyRules.allowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state);
            expect(actual.length).toBe(0);
        });
    });
});