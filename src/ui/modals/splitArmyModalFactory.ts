import ModalRenderer from './modalFactory';
import {House} from '../../logic/house';
import {Unit, UnitType} from '../../logic/units';
import {Area, AreaKey} from '../../logic/area';
export default class SplitArmyModalFactory {

    static showModal(game: Phaser.Game, sourceArea: Area, targetAreaKey: AreaKey, yesFn: Function, noFn: Function) {

        let modal = ModalRenderer.createModal(game);
        let unitsToMove: Array<Unit> = [];

        this.addImageForEachUnit(modal, sourceArea.units, unitsToMove);
        ModalRenderer.addText(modal, 'Select units to move from ' + sourceArea.key + ' to ' + targetAreaKey, -100);
        ModalRenderer.addText(modal, 'More orders for ' + sourceArea.key, 50);
        ModalRenderer.addText(modal, 'Yes', 100, -100, () => {
            yesFn(unitsToMove);
            modal.visible = false;
            modal.destroy();
        });
        ModalRenderer.addText(modal, 'No', 100, 100, () => {
            noFn(unitsToMove);
            modal.visible = false;
            modal.destroy();
        });
        game.world.bringToTop(modal);
        modal.visible = true;
    }

    private static addImageForEachUnit(modal: Phaser.Group, availableUnits: Array<Unit>, unitsToMove: Array<Unit>) {
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
            });

            offsetX += offsetXIncrement;
        });
    }

}