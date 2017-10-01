import ModalRenderer from './modalFactory';
import {House} from '../../logic/house';
import {Unit, UnitType} from '../../logic/units';
import {Area, AreaKey} from '../../logic/area';
export default class SplitArmyModalFactory {

    static showModal(game: Phaser.Game, sourceArea: Area, targetAreaKey: AreaKey, yesFn: Function, noFn: Function) {

        let modal = ModalRenderer.createModal(game);
        let unitsToMove: Array<Unit> = [];

        let moreOrdersQuestionGroup = this.addMoreOrdersGroup(modal, noFn, yesFn, unitsToMove, sourceArea);
        let otherOrdersText = ModalRenderer.addText(modal, 'Take other orders', 100, 0, true, () => {
            this.closeModal(modal);
        });
        let allUnitsText = ModalRenderer.addText(modal, 'Move all Units', 100, 0, false, () => {
            noFn(unitsToMove);
            this.closeModal(modal);
        });
        this.addImageForEachUnit(modal, sourceArea.units, unitsToMove, moreOrdersQuestionGroup, otherOrdersText, allUnitsText);
        ModalRenderer.addText(modal, 'Select units to move from ' + sourceArea.key + ' to ' + targetAreaKey, -100);

        game.world.bringToTop(modal);
        modal.visible = true;
    }

    private static addImageForEachUnit(modal: Phaser.Group, availableUnits: Array<Unit>, unitsToMove: Array<Unit>, moreOrdersQuestionsGroup: Phaser.Group, otherOrdersText: Phaser.Text, allUnitsText: Phaser.Text) {
        let offsetXIncrement = 60;
        let offsetX = -1 * offsetXIncrement * availableUnits.length / 2;
        availableUnits.forEach((unit) => {
            let content = House[unit.getHouse()] + UnitType[unit.getType()];
            let selected = false;
            ModalRenderer.addClickableImage(modal, content, 0, offsetX, () => {
                selected = !selected;
                if (selected) {
                    unitsToMove.push(unit);
                }
                else {
                    let index = unitsToMove.indexOf(unit);
                    unitsToMove.splice(index, 1);
                }

                if (unitsToMove.length === 0) {
                    moreOrdersQuestionsGroup.visible = false;
                    otherOrdersText.visible = true;
                    allUnitsText.visible = false;
                }
                else if (unitsToMove.length === availableUnits.length) {
                    moreOrdersQuestionsGroup.visible = false;
                    otherOrdersText.visible = false;
                    allUnitsText.visible = true;
                }
                else {
                    moreOrdersQuestionsGroup.visible = true;
                    otherOrdersText.visible = false;
                    allUnitsText.visible = false;
                }

            });

            offsetX += offsetXIncrement;
        });
    }


    private static addMoreOrdersGroup(modal: Phaser.Group, noFn: Function, yesFn: Function, unitsToMove: Array<Unit>, sourceArea: Area) {
        let moreOrdersQuestionGroup = modal.game.add.group();
        let noText = ModalRenderer.addText(modal, 'No', 100, 100, true, () => {
            noFn(unitsToMove);
            this.closeModal(modal);
        });
        moreOrdersQuestionGroup.add(noText);
        let yesText = ModalRenderer.addText(modal, 'Yes', 100, -100, true, () => {
            yesFn(unitsToMove);
            this.closeModal(modal);
        });
        moreOrdersQuestionGroup.add(yesText);
        let moreOrdersText = ModalRenderer.addText(modal, 'More orders for ' + sourceArea.key, 50);
        moreOrdersQuestionGroup.add(moreOrdersText);
        moreOrdersQuestionGroup.visible = false;
        modal.add(moreOrdersQuestionGroup);
        modal.bringToTop(moreOrdersQuestionGroup);
        return moreOrdersQuestionGroup;
    }

    private static closeModal(modal) {
        modal.visible = false;
        modal.destroy();
    }
}