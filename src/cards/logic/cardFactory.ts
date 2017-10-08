import {House} from '../../logic/house';

import * as houseCardData from './houseCard.json';
import * as westerosCardData from './westeroscard.json';
import HouseCard from './houseCard';
import {WesterosCard} from './westerosCard';
import CardFunction from './cardFuncttion';
export default class CardFactory {

    public static getHouseCards(house: House): Array<HouseCard> {
        let cards = new Array<HouseCard>();

        (<any>houseCardData).forEach((jsonCard) => {
            cards.push(this.parseHouseCards(jsonCard));
        });

        return cards.filter((card) => {
            return card.house === house;
        });

    }

    public static getWesterosCards(cardType: number): Array<WesterosCard> {
        let cards = new Array<WesterosCard>();

        (<any>westerosCardData).forEach((jsonCard) => {
            let type = jsonCard.cardType;
            if (cardType === type) {
                let count = westerosCards[cardType - 1].filter((cardId) => {
                    return cardId === jsonCard.id;
                }).length;
                for (let i = 0; i < count; i++) {
                    cards.push(this.parseWesterosCards(jsonCard));
                }
            }
        });
        cards.filter((card) => {
            return card.cardType === cardType;
        });

        this.shuffle(cards);
        return cards;

    }

    public static shuffle(cards: Array<any>) {
        for (let i = cards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]];
        }
    }

    public static playNextCard(westerosCards: Array<WesterosCard>): WesterosCard {
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        return cardToPlay;
    }

    private static parseHouseCards(json: any): HouseCard {
        let house = <string>json.house;
        return new HouseCard(json.id, json.leaderName, json.artWork, json.combatStrength, json.sword, json.fortification, json.ability, json.abilityFn, House[house], json.cardExecutionPoint);
    }

    private static parseWesterosCards(json: any): WesterosCard {
        let cardFunctions = new Array<CardFunction>();
        json.options.forEach((option) => {
            cardFunctions.push(new CardFunction(option.functionName, option.description));
        });
        return new WesterosCard(json.id, json.title, json.description, json.artwork, json.cardType, json.wildling, cardFunctions);
    }

}

let westerosCards = [
    [1, 2, 2, 3, 3, 3, 4, 4, 4, 5],
    [6, 6, 7, 8, 8, 8, 9, 9, 9, 10],
    [11, 11, 12, 13, 14, 15, 15, 15, 16, 17]
];