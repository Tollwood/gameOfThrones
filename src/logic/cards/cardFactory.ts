import * as westerosCardData from './westeroscard.json';
import {WesterosCard} from './westerosCard';
import CardFunction from './cardFuncttion';
import {ALL_PHASES, GamePhase} from '../board/gamePhase';

export default class CardFactory {

    public static shuffle(cards: Array<any>) {
        for (let i = cards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]];
        }
    }

    public static getWesterosCards(): Map<GamePhase, WesterosCard[]> {
        const cards = new Map<GamePhase, WesterosCard[]>();
        cards.set(GamePhase.WESTEROS1, []);
        cards.set(GamePhase.WESTEROS2, []);
        cards.set(GamePhase.WESTEROS3, []);

        (<any>westerosCardData).forEach((jsonCard) => {
            const gamePhase: GamePhase = jsonCard.gamePhase;
            let count = westerosCards[ALL_PHASES.lastIndexOf(gamePhase)].filter((cardId) => {
                return cardId === jsonCard.id;
            }).length;
            for (let i = 0; i < count; i++) {
                cards.get(gamePhase).push(this.parseWesterosCards(jsonCard));
            }

        });

        cards.forEach(cards => this.shuffle(cards));
        return cards;

    }

    private static parseWesterosCards(json: any): WesterosCard {
        let cardFunctions = new Array<CardFunction>();
        json.options.forEach((option) => {
            cardFunctions.push(new CardFunction(option.functionName, option.description));
        });
        return new WesterosCard(json.id, json.title, json.description, json.artwork, json.gamePhase, json.wildling, cardFunctions);
    }

}

let westerosCards = [
    [1, 2, 2, 3, 3, 3, 4, 4, 4, 5],
    [6, 6, 7, 8, 8, 8, 9, 9, 9, 10],
    [11, 11, 12, 13, 14, 15, 15, 15, 16, 17]
];
