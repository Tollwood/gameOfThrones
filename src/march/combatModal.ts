import {Area} from '../board/logic/area';
import {House} from '../board/logic/house';
import CombatResultModal from './combatResultModal';
import CombatCalculator from './combatCalculator';
import HouseCard from '../cards/logic/houseCard';
import {CardExecutionPoint} from '../cards/logic/cardExecutionPoint';
import Modal from '../utils/modal';
export default class CombatModal extends Modal {

    constructor(game: Phaser.Game, sourceArea: Area, targetArea: Area, onCloseFn: Function) {
        super(game);
        this.addText('Attack ' + House[targetArea.controllingHouse] + ' in ' + targetArea.key, -50, 0);
        this.addText('Follow my orders!', 50, -100, true, () => {
            let attackersCard = new HouseCard(1, 'SomeOne', null, 0, 0, 0, 'double Defense Token', 'doubleDefenseToken', House.stark, CardExecutionPoint.beforeFight);
            let defendersCard = new HouseCard(2, 'SomeOne', null, 0, 0, 0, 'get all cards back', 'getAllCardsBack', House.stark, CardExecutionPoint.afterFight);
            let combatResult = CombatCalculator.calculateCombat(sourceArea, targetArea, attackersCard, defendersCard);
            let modal = new CombatResultModal(game, combatResult, onCloseFn);
            modal.show();
            this.close();
        });

        this.addText('No fight today', 50, 100, true, () => {
            this.close();
        });
    }

}