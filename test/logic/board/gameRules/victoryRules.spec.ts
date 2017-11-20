import VictoryRules from '../../../../src/logic/board/gameRules/victoryRules';
import {Area} from '../../../../src/logic/board/area';
import GameState from '../../../../src/logic/board/gameState/GameState';
import {House} from '../../../../src/logic/board/house';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
describe('VictoryRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
        gameState.players = [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])];
    });


    describe('getVictoryPositionFor', () => {
        it('should count castle and stronghold for given house', () => {
            let winterfell = new AreaBuilder('Winterfell').withStronghold().withHouse(House.stark).build();

            gameState.areas.push(winterfell);
            let whiteHarbor = new AreaBuilder('WhiteHarbor').withCastle().withHouse(House.stark).build();
            gameState.areas.push(whiteHarbor);
            GameRules.load(gameState);
            const actual = VictoryRules.getVictoryPositionFor(House.stark);
            expect(actual).toBe(2);
        });

    });

    describe('getWinningHouse', () => {
        it('should return null if no one has 7 strongholds/ castle and gameRound is smaller or equal 10', () => {
            gameState.round = 10;

            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBeNull();
        });


        it('should return the house that has exactly 7 strongholds/ castle', () => {
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            let winterfell = new Area('Winterfell', 0, false, true, false, 0, 0, House.stark);
            gameState.areas.push(winterfell);
            gameState.round = 1;
            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBe(House.stark);
        });

        it('should return the house with most strongholds/castle after round 10 was completed', () => {
            let winterfell = new AreaBuilder('Winterfell').withStronghold().withHouse(House.stark).build();
            gameState.areas.push(winterfell);
            let whiteHarbour = new AreaBuilder('WiteHarbour').withStronghold().withHouse(House.lannister).build();
            gameState.areas.push(whiteHarbour);
            let castleBlack = new AreaBuilder('CastleBlack').withStronghold().withHouse(House.lannister).build();
            gameState.areas.push(castleBlack);
            gameState.round = 11;
            GameRules.load(gameState);
            const actual = VictoryRules.getWinningHouse();
            expect(actual).toBe(House.lannister);
        });
    });
});