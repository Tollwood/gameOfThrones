import {House} from '../logic/house';

import * as data from './card.json';

import Card from './card';
export default class CardFactory {

    public static getCards(house: House): Array<Card> {
        let cards = new Array<Card>();


        (<any>data).forEach((jsonCard) => {
            cards.push(this.parse(jsonCard));
        });

        return cards.filter((card) => {
            return card.house === house;
        });

    }

    private static parse(json: any) {
        let house = <string>json.house;
        return new Card(json.id, json.leaderName, json.artWork, json.combatStrength, json.sword, json.fortification, json.ability, json.abilityFn, House[house], json.cardExecutionPoint);
    }
}