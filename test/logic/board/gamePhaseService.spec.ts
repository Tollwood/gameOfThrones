import GamePhaseService from '../../../src/logic/board/gamePhaseService';
import {GamePhase} from '../../../src/logic/board/gamePhase';
import {House} from '../../../src/logic/board/house';
import AreaBuilder from '../../areaBuilder';
import {UnitType} from '../../../src/logic/units/unitType';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {Area} from '../../../src/logic/board/area';

describe('GamePhaseService', () => {

    describe('getNextGamePhase', () => {

    });

    describe('updateGamePhaseAfterRecruiting', () => {

    });

    describe('getNextPhaseAndPlayer', () => {

    });


    describe('updateGamePhaseAfterRecruiting', () => {
        it('should return next player in the order of ironThrone that can recruit', () => {
            // given
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build());
            areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).withUnits([UnitType.Footman]).build());
            const areaKey = AreaKey.Winterfell;
            const currentlyAllowedSupply = new TSMap<House, number>();
            currentlyAllowedSupply.set(House.stark, 3);
            currentlyAllowedSupply.set(House.lannister, 3);
            const state = {
                areas: areas,
                areasAllowedToRecruit: [AreaKey.Winterfell, AreaKey.Pyke],
                gamePhase: GamePhase.WESTEROS1,
                ironThroneSuccession: [House.stark, House.lannister],
                currentHouse: House.stark,
                currentlyAllowedSupply
            };
            // when
            const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
            // then

            expect(actual.gamePhase).toBe(state.gamePhase);
            expect(actual.currentHouse).toBe(House.lannister);
        });
        it('should return first of ironThroneSuccsession and next GamePhase if noone can recruit', () => {
            // given
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build());
            areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).build());
            const areaKey = AreaKey.Winterfell;
            const currentlyAllowedSupply = new TSMap<House, number>();
            currentlyAllowedSupply.set(House.stark, 0);
            currentlyAllowedSupply.set(House.lannister, 0);
            const state = {
                areas: areas,
                areasAllowedToRecruit: [],
                gamePhase: GamePhase.WESTEROS1,
                ironThroneSuccession: [House.baratheon, House.stark, House.lannister],
                currentHouse: House.stark,
                currentlyAllowedSupply
            };
            // when
            const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
            // then

            expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
            expect(actual.currentHouse).toBe(House.baratheon);
        });
        it('should return currentPlayer if he is the only one who can recruit', () => {
            // given
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build());
            areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).build());
            const areaKey = AreaKey.Winterfell;
            const currentlyAllowedSupply = new TSMap<House, number>();
            currentlyAllowedSupply.set(House.stark, 0);
            currentlyAllowedSupply.set(House.lannister, 0);
            const state = {
                areas: areas,
                areasAllowedToRecruit: [AreaKey.Winterfell],
                gamePhase: GamePhase.WESTEROS1,
                ironThroneSuccession: [House.baratheon, House.stark, House.lannister],
                currentHouse: House.stark,
                currentlyAllowedSupply
            };
            // when
            const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
            // then

            expect(actual.gamePhase).toBe(state.gamePhase);
            expect(actual.currentHouse).toBe(House.stark);
        });
    });
});