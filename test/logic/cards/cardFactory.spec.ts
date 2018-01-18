import CardFactory from '../../../src/logic/cards/cardFactory';
import {GamePhase} from '../../../src/logic/board/gamePhase';

describe('CardFactory', () => {
    describe('getWesterosCards', () => {
        it(' should read json and return all westerosCards', () => {
            // when
            const actual = CardFactory.getWesterosCards();

            // then
            const westeros1Cards = actual.get(GamePhase.WESTEROS1);
            expect(westeros1Cards.length).toBe(10);
            expect(westeros1Cards.filter(card => card.id === 1).length).toBe(1);
            expect(westeros1Cards.filter(card => card.id === 2).length).toBe(2);
            expect(westeros1Cards.filter(card => card.id === 3).length).toBe(3);
            expect(westeros1Cards.filter(card => card.id === 4).length).toBe(3);
            expect(westeros1Cards.filter(card => card.id === 5).length).toBe(1);

            const westeros2Cards = actual.get(GamePhase.WESTEROS2);
            expect(westeros2Cards.filter(card => card.id === 6).length).toBe(2);
            expect(westeros2Cards.filter(card => card.id === 7).length).toBe(1);
            expect(westeros2Cards.filter(card => card.id === 8).length).toBe(3);
            expect(westeros2Cards.filter(card => card.id === 9).length).toBe(3);
            expect(westeros2Cards.filter(card => card.id === 10).length).toBe(1);

            const westeros3Cards = actual.get(GamePhase.WESTEROS3);
            expect(westeros3Cards.length).toBe(10);
            expect(westeros3Cards.filter(card => card.id === 11).length).toBe(2);
            expect(westeros3Cards.filter(card => card.id === 12).length).toBe(1);
            expect(westeros3Cards.filter(card => card.id === 13).length).toBe(1);
            expect(westeros3Cards.filter(card => card.id === 14).length).toBe(1);
            expect(westeros3Cards.filter(card => card.id === 15).length).toBe(3);
            expect(westeros3Cards.filter(card => card.id === 16).length).toBe(1);
            expect(westeros3Cards.filter(card => card.id === 17).length).toBe(1);
        });
    });
});