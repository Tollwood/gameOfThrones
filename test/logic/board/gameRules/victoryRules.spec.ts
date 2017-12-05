import VictoryRules from '../../../../src/logic/board/gameRules/victoryRules';
import {House} from '../../../../src/logic/board/house';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame, nextPhase, resetGame} from '../../../../src/logic/board/gameState/actions';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
describe('VictoryRules', () => {

    beforeEach(() => {
        gameStore.dispatch(resetGame());
    });


    describe('getVictoryPositionFor', () => {
        it('should count castle and stronghold for given house', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withCastle().withHouse(House.stark).build();
            let gameStoreState = {
                players: [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])],
                areas: [winterfell, whiteHarbor]
            };
            gameStore.dispatch(loadGame(gameStoreState));
            const actual = VictoryRules.getVictoryPositionFor(House.stark);
            expect(actual).toBe(2);
        });
    });

    describe('getWinningHouse', () => {
        it('should return null if no one has 7 strongholds/ castle and gameRound is smaller or equal 10', () => {
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
            let gameStoreState = {
                players: [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])],
                areas: [winterfell, whiteHarbor, castleBlack, pyke, bayOfIce, blackWater, blackWaterBay]
            };
            gameStore.dispatch(loadGame(gameStoreState));
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBe(House.stark);
        });

        it('should return the house with most strongholds/castle after round 10 was completed', () => {
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();
            let whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withHouse(House.lannister).build();
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withStronghold().withHouse(House.lannister).build();

            const gameStoreState = {
                gameRound: 10,
                gamePhase: GamePhase.ACTION_CLEANUP,
                ironThroneSuccession: [House.stark, House.lannister],
                players: [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])],
                areas: [winterfell, whiteHarbour, castleBlack]
            };
            gameStore.dispatch(loadGame(gameStoreState));
            gameStore.dispatch(nextPhase());
            expect(gameStore.getState().winningHouse).toBe(House.lannister);
        });
    });
});