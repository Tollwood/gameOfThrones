import ModalRenderer from './modal';
import {House} from '../../logic/house';
import {Unit, UnitType} from '../../logic/units';
import {Area, AreaKey} from '../../logic/area';
export default class SplitArmyModalFactory {


    static showModal(game: Phaser.Game, sourceArea: Area, targetAreaKey: AreaKey, yesFn: Function, noFn: Function) {


        let items = new Array<any>();
        let modal = ModalRenderer.createModal(game, items);
        let units: Array<Unit> = new Array();

        let offsetXIncrement = 60;
        let offsetX = -1 * offsetXIncrement * sourceArea.units.length / 2;
        sourceArea.units.forEach((unit) => {
            let content = House[unit.getHouse()] + UnitType[unit.getType()];
            let selected = false;
            ModalRenderer.addImage(modal, content, 0, offsetX, () => {
                selected = !selected;
                if (selected) {
                    units.push(unit);
                }
                else {
                    let index = units.indexOf(unit);
                    units.splice(index, 1);
                }
                console.log(units);
            });

            offsetX += offsetXIncrement;
        });
        ModalRenderer.addText(modal, 'Select units to move from ' + sourceArea.key + ' to ' + targetAreaKey, -100);
        ModalRenderer.addText(modal, 'More orders for ' + sourceArea.key, 50);
        ModalRenderer.addText(modal, 'Yes', 100, -100, () => {
            yesFn(units);
            modal.visible = false;
            modal.destroy();
        });
        ModalRenderer.addText(modal, 'No', 100, 100, () => {
            noFn(units);
            modal.visible = false;
            modal.destroy();
        });
        game.world.bringToTop(modal);
        modal.visible = true;
    }
}