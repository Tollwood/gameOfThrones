import WesterosCardRules from '../../../../src/logic/board/gameRules/westerosCardRules';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {WesterosCard} from '../../../../src/logic/cards/westerosCard';
import CardFunction from '../../../../src/logic/cards/cardFuncttion';
import GameState from '../../../../src/logic/board/gameState/GameState';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame} from '../../../../src/logic/board/gameState/actions';
import game = PIXI.game;
describe('WesterosCardRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    describe('getNextCard', () => {
        it('should play westerosCards1 if cardTpye is 1', () => {
            const expectedCard = new WesterosCard(1, '', '', '', 1, 1, []);
            gameState.westerosCards1 = [expectedCard];
            GameRules.load(gameState);
            const card: WesterosCard = WesterosCardRules.getNextCard(1);
            expect(card).toEqual(expectedCard);
        });

        it('should play westerosCards2 if cardTpye is 2', () => {
            const expectedCard = new WesterosCard(1, '', '', '', 2, 1, []);
            gameState.westerosCards2 = [expectedCard];
            GameRules.load(gameState);
            const card: WesterosCard = WesterosCardRules.getNextCard(2);
            expect(card).toEqual(expectedCard);
        });

        it('should play westerosCards3 if cardTpye is 3', () => {
            const expectedCard = new WesterosCard(1, '', '', '', 3, 1, []);
            gameState.westerosCards3 = [expectedCard];
            GameRules.load(gameState);
            const card: WesterosCard = WesterosCardRules.getNextCard(3);
            expect(card).toEqual(expectedCard);
        });
    });


    describe('stillPlayingWesterosCard', () => {

        it('should return true if not all areas have recruited, while playing the recruit card', () => {
            const cardFunction = new CardFunction('recruit', '');
            gameState.currentWesterosCard = new WesterosCard(1, '', '', '', 1, 1, [cardFunction]);
            gameState.currentWesterosCard.selectedFunction = cardFunction;
            gameStore.dispatch(loadGame({areasAllowedToRecruit: [AreaKey.Winterfell]}));
            GameRules.load(gameState);
            const actual = WesterosCardRules.stillPlayingWesterosCard();
            expect(actual).toBeTruthy();
        });

        it('should return false if all areas have recruited, while playing the recruit card', () => {
            const cardFunction = new CardFunction('recruit', '');
            gameState.currentWesterosCard = new WesterosCard(1, '', '', '', 1, 1, [cardFunction]);
            gameState.currentWesterosCard.selectedFunction = cardFunction;
            GameRules.load(gameState);
            const gameStoreState = {areasAllowedToRecruit: []};
            gameStore.dispatch(loadGame(gameStoreState));
            const actual = WesterosCardRules.stillPlayingWesterosCard();
            expect(actual).toBeFalsy();
        });

        it('should return false by default', () => {
            const cardFunction = new CardFunction('nothing', '');
            gameState.currentWesterosCard = new WesterosCard(1, '', '', '', 1, 1, [cardFunction]);
            gameState.currentWesterosCard.selectedFunction = cardFunction;
            GameRules.load(gameState);
            const actual = WesterosCardRules.stillPlayingWesterosCard();
            expect(actual).toBeFalsy();
        });
    });

});