import VictoryRules from '../../../../src/logic/board/gameRules/victoryRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import {House} from '../../../../src/logic/board/house';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {incrementGameRound, resetGame} from '../../../../src/logic/board/gameState/actions';
describe('VictoryRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
        gameStore.dispatch(resetGame());
        gameState.players = [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])];
    });


    describe('getVictoryPositionFor', () => {
        it('should count castle and stronghold for given house', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();

            gameState.areas.push(winterfell);
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withCastle().withHouse(House.stark).build();
            gameState.areas.push(whiteHarbor);
            GameRules.load(gameState);
            const actual = VictoryRules.getVictoryPositionFor(House.stark);
            expect(actual).toBe(2);
        });

    });

    describe('getWinningHouse', () => {
        it('should return null if no one has 7 strongholds/ castle and gameRound is smaller or equal 10', () => {
            gameStore.dispatch(incrementGameRound(10));
            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBeNull();
        });


        it('should return the house that has exactly 7 strongholds/ castle', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withHouse(House.stark).build();
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withStronghold().withHouse(House.stark).build();
            let pyke = new AreaBuilder(AreaKey.Pyke).withStronghold().withHouse(House.stark).build();
            let bayOfIce = new AreaBuilder(AreaKey.BayOfIce).withStronghold().withHouse(House.stark).build();
            let blackWater = new AreaBuilder(AreaKey.Blackwater).withStronghold().withHouse(House.stark).build();
            let blackWaterBay = new AreaBuilder(AreaKey.BlackwaterBay).withStronghold().withHouse(House.stark).build();
            gameState.areas.push(winterfell, whiteHarbor, castleBlack, pyke, bayOfIce, blackWater, blackWaterBay);
            gameStore.dispatch(incrementGameRound(1));
            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBe(House.stark);
        });

        it('should return the house with most strongholds/castle after round 10 was completed', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();
            gameState.areas.push(winterfell);
            let whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withHouse(House.lannister).build();
            gameState.areas.push(whiteHarbour);
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withStronghold().withHouse(House.lannister).build();
            gameState.areas.push(castleBlack);
            gameStore.dispatch(incrementGameRound(11));
            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBe(House.lannister);
        });
    });
});