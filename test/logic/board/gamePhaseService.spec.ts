import GameState from '../../../src/logic/board/gameState/GameState';
import GamePhaseService from '../../../src/logic/board/gamePhaseService';
import {GamePhase} from '../../../src/logic/board/gamePhase';
import {OrderToken} from '../../../src/logic/orderToken/orderToken';
import {House} from '../../../src/logic/board/house';
import GameRules from '../../../src/logic/board/gameRules/gameRules';
import AreaBuilder from '../../areaBuilder';
import {UnitType} from '../../../src/logic/units/unitType';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../src/logic/orderToken/orderTokenType';
import {gameStore, GameStoreState} from '../../../src/logic/board/gameState/reducer';
import {loadGame, nextPhase, nextPlayer} from '../../../src/logic/board/gameState/actions';
import {TSMap} from 'typescript-map';
import {Area} from '../../../src/logic/board/area';

describe('GamePhaseService', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    describe('isActionPhase', () => {
        it('should return true if gamePhase is ACTION_RAID', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_RAID)).toBeTruthy();
        });

        it('should return true if gamePhase is ACTION_MARCH', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_MARCH)).toBeTruthy();
        });

        it('should return true if gamePhase is ACTION_CLEANUP', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_CLEANUP)).toBeTruthy();
        });

    });

    describe('isActionPhase', () => {
        it('should return true if gamePhase is WESTEROS1', () => {
            expect(GamePhaseService.isWesterosPhase(GamePhase.WESTEROS1)).toBeTruthy();
        });

        it('should return true if gamePhase is WESTEROS2', () => {
            expect(GamePhaseService.isWesterosPhase(GamePhase.WESTEROS2)).toBeTruthy();
        });

        it('should return true if gamePhase is WESTEROS3', () => {
            expect(GamePhaseService.isWesterosPhase(GamePhase.WESTEROS3)).toBeTruthy();
        });

    });

    describe('isStillIn', () => {
        it('should return true if not all raid Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.raid_0);
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            gameStore.dispatch(loadGame({areas}));
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_RAID)).toBeTruthy();
        });

        it('should return true if not all March Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            gameStore.dispatch(loadGame({areas}));
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_MARCH)).toBeTruthy();
        });

        it('should return true if not all Consolidate Power Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.consolidatePower_0);
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            gameStore.dispatch(loadGame({areas}));
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_CLEANUP)).toBeTruthy();
        });

        it('should return true if not all Consolidate Power Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            gameStore.dispatch(loadGame({areas}));
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_CLEANUP)).toBeFalsy();
        });
    });


    describe('allRaidOrdersRevealed', () => {
        it('should return false if not all raid Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.raid_0);
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            gameStore.dispatch(loadGame({areas}));
            expect(GamePhaseService.allRaidOrdersRevealed(House.stark)).toBeFalsy();
        });
    });

    describe('allOrderTokenPlaced', () => {
        it('should return true if all areas with units have an order Token', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).withOrderToken(OrderTokenType.consolidatePower_1).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.WESTEROS1;
            storeGameState.areas = areas;
            gameStore.dispatch(loadGame(storeGameState));
            expect(GamePhaseService.allOrderTokenPlaced()).toBeTruthy();
        });

        it('should return false if not all Token are played yet', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.WESTEROS1;
            storeGameState.areas = areas;
            gameStore.dispatch(loadGame(storeGameState));
            GameRules.load(gameState);
            expect(GamePhaseService.allOrderTokenPlaced()).toBeFalsy();
        });

        it('should return true if all areas that belong to a given house have an order token', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.WESTEROS1;
            storeGameState.areas = areas;
            gameStore.dispatch(loadGame(storeGameState));
            GameRules.load(gameState);
            expect(GamePhaseService.allOrderTokenPlaced(House.stark)).toBeTruthy();
        });
    });

    describe('allMarchOrdersRevealed', () => {
        it('should return false if house has not  played all march tokens yet', () => {
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            gameStore.dispatch(loadGame({areas: areas}));
            const actual = GamePhaseService.allMarchOrdersRevealed(House.stark);
            expect(actual).toBeFalsy();

        });
    });


    describe('isPlanningPhaseComplete', () => {
        it('should return false not all areas with units have an orderToken', () => {
            const areaKey = AreaKey.Winterfell;
            const winterfellArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
            const ironmansBayArea = new AreaBuilder(AreaKey.IronmansBay).withHouse(House.lannister).build();
            const whiteHarborArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman]).build();

            const areas: Area[] = [whiteHarborArea, winterfellArea, ironmansBayArea];
            const actual = GamePhaseService.isPlanningPhaseComplete(areas, areaKey);
            expect(actual).toBeFalsy();
        });

        it('should return true if all areas have an orderToken', () => {
            const areaKey = AreaKey.Winterfell;
            const winterfellArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
            const ironmansBayArea = new AreaBuilder(AreaKey.IronmansBay).withHouse(House.lannister).build();
            const whiteHarborArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withOrderToken(OrderTokenType.march_zero).withUnits([UnitType.Footman]).build();

            const areas: Area[] = [whiteHarborArea, winterfellArea, ironmansBayArea];
            const actual = GamePhaseService.isPlanningPhaseComplete(areas, areaKey);
            expect(actual).toBeTruthy();
        });
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

            expect(actual.gamePhase).toBe(state.gamePhase + 1);
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