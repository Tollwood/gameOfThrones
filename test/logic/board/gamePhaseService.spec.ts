import GameState from '../../../src/logic/board/gameState/GameState';
import GamePhaseService from '../../../src/logic/board/gamePhaseService';
import {GamePhase} from '../../../src/logic/board/gamePhase';
import {OrderToken} from '../../../src/logic/orderToken/orderToken';
import {House} from '../../../src/logic/board/house';
import GameRules from '../../../src/logic/board/gameRules/gameRules';
import Player from '../../../src/logic/board/player';
import AreaBuilder from '../../areaBuilder';
import {UnitType} from '../../../src/logic/units/unitType';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../src/logic/orderToken/orderTokenType';
import {
    gameStore, GameStoreState,
    INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
} from '../../../src/logic/board/gameState/reducer';
import {loadGame, nextPhase, nextPlayer, resetGame} from '../../../src/logic/board/gameState/actions';
describe('GamePhaseService', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
        gameStore.dispatch(resetGame());
    });

    describe('isActionPhase', () => {
        it('should return true if gamePhase is ACTION_RAID', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_RAID)).toBeTruthy();
        });

        it('should return true if gamePhase is ACTION_MARCH', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_MARCH)).toBeTruthy();
        });

        it('should return true if gamePhase is ACTION_CONSOLIDATE_POWER', () => {
            expect(GamePhaseService.isActionPhase(GamePhase.ACTION_CONSOLIDATE_POWER)).toBeTruthy();
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
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_RAID)).toBeTruthy();
        });

        it('should return true if not all March Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_MARCH)).toBeTruthy();
        });

        it('should return true if not all Consolidate Power Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.consolidatePower_0);
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_CONSOLIDATE_POWER)).toBeTruthy();
        });

        it('should return true if not all Consolidate Power Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.consolidatePower_0);
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_CLEANUP)).toBeTruthy();
        });

        it('should return true if not all Consolidate Power Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.isStillIn(GamePhase.ACTION_CLEANUP)).toBeFalsy();
        });
    });


    describe('allRaidOrdersRevealed', () => {
        it('should return false if not all raid Token are played yet', () => {
            let area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            area.orderToken = new OrderToken(House.stark, OrderTokenType.raid_0);
            gameState.areas.push(area);
            GameRules.load(gameState);
            expect(GamePhaseService.allRaidOrdersRevealed(House.stark)).toBeFalsy();
        });
    });

    describe('allOrderTokenPlaced', () => {
        it('should return true if all areas with units have an order Token', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).withOrderToken(OrderTokenType.consolidatePower_1).build();
            gameState.areas.push(winterfell, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.PLANNING;
            gameStore.dispatch(loadGame(storeGameState));
            GameRules.load(gameState);
            expect(GamePhaseService.allOrderTokenPlaced()).toBeTruthy();
        });

        it('should return false if not all Token are played yet', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).build();
            gameState.areas.push(winterfell, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.PLANNING;
            gameStore.dispatch(loadGame(storeGameState));
            GameRules.load(gameState);
            expect(GamePhaseService.allOrderTokenPlaced()).toBeFalsy();
        });

        it('should return true if all areas that belong to a given house have an order token', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Footman]).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).withHouse(House.lannister).build();
            gameState.areas.push(winterfell, whiteHarbor);
            let storeGameState = new GameStoreState();
            storeGameState.gamePhase = GamePhase.PLANNING;
            gameStore.dispatch(loadGame(storeGameState));
            GameRules.load(gameState);
            expect(GamePhaseService.allOrderTokenPlaced(House.stark)).toBeTruthy();
        });
    });


    describe('nextRound', () => {
        it('should modify state to be ready for next game round', () => {

            const gameStoreState = {
                gameRound: 1,
                gamePhase: GamePhase.ACTION_CLEANUP,
                ironThroneSuccession: [House.stark, House.lannister],
                players: [new Player(House.lannister, 0, []), new Player(House.stark, 0, [])]

            };
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            gameStore.dispatch(loadGame(gameStoreState));
            gameState.areas = [winterfell];
            GameRules.load(gameState);
            gameStore.dispatch(nextPhase());

            expect(gameStore.getState().currentlyAllowedTokenTypes).toEqual(INITIALLY_ALLOWED_ORDER_TOKEN_TYPES);
            expect(gameStore.getState().gameRound).toBe(2);
            expect(gameStore.getState().gamePhase).toBe(GamePhase.WESTEROS1);
            expect(gameStore.getState().currentPlayer.house).toBe(House.stark);
            expect(gameState.areas.filter(area => area.orderToken !== null).length).toBe(0);
        });
    });

    describe('nextPlayer', () => {
        it('should take the next player in the ironThroneSuccession', () => {
            // given
            const playerStark = new Player(House.stark, 0, []);
            const playerLannister = new Player(House.lannister, 0, []);

            const gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerLannister, playerStark],
                currentPlayer: playerLannister
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            gameStore.dispatch(nextPlayer());

            // then
            expect(gameStore.getState().currentPlayer).toBe(playerStark);

        });

        it('should take the first in the ironThroneSuccession, after the last in ironThroneSuccession', () => {
            // given
            const playerStark = new Player(House.stark, 0, []);
            const playerLannister = new Player(House.lannister, 0, []);
            const gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerLannister, playerStark],
                currentPlayer: playerStark
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            gameStore.dispatch(nextPlayer());
            // then
            expect(gameStore.getState().currentPlayer).toBe(playerLannister);
        });
    });

    describe('switchToNextPhase', () => {
        it('should increase GamePhase By one and set first of ironThroneSussession as currentplayer', () => {
            const playerStark = new Player(House.stark, 0, []);
            const playerLannister = new Player(House.lannister, 0, []);
            gameStore.dispatch(loadGame({
                gamePhase: GamePhase.ACTION_RAID,
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerLannister, playerStark],
            }));

            GamePhaseService.switchToNextPhase();
            expect(gameStore.getState().gamePhase).toBe(GamePhase.ACTION_MARCH);
        });
    });

    describe('allMarchOrdersRevealed', () => {
        it('should return false if house has not  played all march tokens yet', () => {
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            gameState.areas.push(winterfell);
            GameRules.load(gameState);
            const actual = GamePhaseService.allMarchOrdersRevealed(House.stark);
            expect(actual).toBeFalsy();

        });
    });
});