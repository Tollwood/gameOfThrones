import {House} from '../../logic/board/house';
import {Area} from '../../logic/board/area';
import Unit from '../../logic/units/units';
import {UnitType} from '../../logic/units/unitType';
import Modal from '../../utils/modal';
import {AreaKey} from '../../logic/board/areaKey';
import {gameStore} from '../../logic/board/gameState/reducer';
import {moveUnits} from '../../logic/board/gameState/actions';
import StateSelectorService from '../../logic/board/gameRules/stateSelectorService';
import Renderer from '../../utils/renderer';
import UiInteractionSupport from '../../utils/uiInteractionSupport';

export default class SplitArmyModal extends Modal {

    // business
    private _establishControl = false;
    private _sourceArea: Area;
    private _targetAreaKey: AreaKey;

    // business + ui
    private _selectableUnits: Array<MovingUnit> = [];

    // ui
    private _otherOrdersText: Phaser.Text;
    private _moveAllUnitsText: Phaser.Text;
    private _moreOrdersQuestionGroup: Phaser.Group;
    private _establishControlText: Phaser.Text;
    private _rectangleAroundEstablishControlText: Phaser.Graphics;
    private _removeTokenFn: Function;

    constructor(renderer: Renderer, sourceArea: Area, targetAreaKey: AreaKey, removeTokenFn: Function) {
        super(renderer);
        this._sourceArea = sourceArea;
        this._targetAreaKey = targetAreaKey;
        this._removeTokenFn = removeTokenFn;
    }

    public show() {

        this.addText('Select units to move from ' + this._sourceArea.key + ' to ' + this._targetAreaKey, -100);
        this.addImageForEachUnit();

        this._moreOrdersQuestionGroup = this.addMoreOrdersGroup();
        this._otherOrdersText = this.addText('Take other orders', 80, 0, true, () => this.close());
        this._moveAllUnitsText = this.addText('Move all Units', 130, 0, false, () => this.moveAllUnits());
        this._establishControlText = this.addText('Establish Control', 80, 0, false, () => this.toggleEstablishControl());
        this._rectangleAroundEstablishControlText = this.drawRectangleAroundObject(this._establishControlText);
        UiInteractionSupport.addInputDownCallback(() => {
            this._rectangleAroundEstablishControlText.visible = !this._rectangleAroundEstablishControlText.visible;
        }, this._establishControlText);
        super.show();
    }

    private addImageForEachUnit() {
        let offsetXIncrement = 60;
        let availableUnits = this._sourceArea.units;
        let offsetX = -1 * offsetXIncrement * availableUnits.length / 2;
        availableUnits.forEach((unit) => {
            let movingUnit: MovingUnit;
            let onUnitSelectFn = () => {
                movingUnit.selected = !movingUnit.selected;
                this.updateModal();
            };
            let content = House[unit.getHouse()] + UnitType[unit.getType()];
            let unitImage = this.addClickableImage(content, 0, offsetX, onUnitSelectFn);
            movingUnit = new MovingUnit(unit, unitImage);
            this._selectableUnits.push(movingUnit);

            offsetX += offsetXIncrement;
        });
    }

    private updateModal() {
        let availableUnits = this._sourceArea.units;
        const tragetArea = StateSelectorService.getAreaByKey(this._targetAreaKey);
        let targetAreaArmySize = tragetArea ? tragetArea.units.length : 0;

        let selectedUnits = this.getSelectedUnits();
        let maxArmySize = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(gameStore.getState(), gameStore.getState().currentHouse);
        let maxArmySizeReached = targetAreaArmySize + selectedUnits.length === maxArmySize;


        if (maxArmySizeReached) {
            this._moreOrdersQuestionGroup.visible = true;
            this._otherOrdersText.visible = false;
            this._moveAllUnitsText.visible = false;
            this._establishControlText.visible = false;
            this.setVisibility(this._selectableUnits, false);
        }
        else {
            this.setVisibility(this._selectableUnits, true);
        }

        if (selectedUnits.length === 0) {
            this._moreOrdersQuestionGroup.visible = false;
            this._otherOrdersText.visible = true;
            this._moveAllUnitsText.visible = false;
            this._establishControlText.visible = false;
        }
        else {
            this._establishControl = false;
            this._rectangleAroundEstablishControlText.visible = false;
        }

        if (selectedUnits.length === availableUnits.length) {
            this._moreOrdersQuestionGroup.visible = false;
            this._otherOrdersText.visible = false;
            this._moveAllUnitsText.visible = true;
            this._establishControlText.visible = StateSelectorService.getPlayerByHouse(gameStore.getState().currentHouse).powerToken > 0;
        }
        else {
            this._moreOrdersQuestionGroup.visible = true;
            this._otherOrdersText.visible = false;
            this._moveAllUnitsText.visible = false;
            this._establishControlText.visible = false;
        }

    };

    private addMoreOrdersGroup(): Phaser.Group {
        let moreOrdersQuestionGroup = this.game.add.group();
        moreOrdersQuestionGroup.visible = false;
        this.add(moreOrdersQuestionGroup);
        this.bringToTop(moreOrdersQuestionGroup);


        let moreOrdersText = this.addText('More orders for ' + this._sourceArea.key, 50);
        moreOrdersQuestionGroup.add(moreOrdersText);

        let yesText = this.addText('Yes', 100, -100, true, () => this.moveUnits());
        moreOrdersQuestionGroup.add(yesText);

        let orderCompleteText = this.addText('No', 100, 100, true, () => this.orderComplete());
        moreOrdersQuestionGroup.add(orderCompleteText);

        return moreOrdersQuestionGroup;
    }

    private setVisibility(unitsToMove: Array<MovingUnit>, visible: boolean) {
        unitsToMove.filter((unitToMove) => {
            return !unitToMove.selected;
        }).forEach((unitToMove) => {
            unitToMove.image.visible = visible;
        });
    }


    private moveAllUnits() {
        gameStore.dispatch(moveUnits(this._sourceArea.key, this._targetAreaKey, this._selectableUnits.map((movingUnit) => {
            return movingUnit.unit;
        }), true, this._establishControl));
        this.closeAndRemoveToken();
    }

    private toggleEstablishControl() {
        this._establishControl = !this._establishControl;
    }


    private moveUnits() {
        gameStore.dispatch(moveUnits(this._sourceArea.key, this._targetAreaKey, this.getSelectedUnits(), false));
        this.close();
    }

    private getSelectedUnits(): Array<Unit> {
        return this._selectableUnits
            .filter((unit) => {
                return unit.selected;
            })
            .map((movingUnit) => {
                return movingUnit.unit;
            });
    }

    private orderComplete() {
        gameStore.dispatch(moveUnits(this._sourceArea.key, this._targetAreaKey, this.getSelectedUnits()));
        this.closeAndRemoveToken();
    }

    closeAndRemoveToken() {
        super.close();
        this._removeTokenFn();
    }
}

class MovingUnit {
    private _unit: Unit;
    private _image: Phaser.Image;
    private _selected: boolean;

    constructor(unit: Unit, image: Phaser.Image, selected: boolean = false) {
        this._unit = unit;
        this._image = image;
        this._selected = selected;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
    }

    get image(): Phaser.Image {
        return this._image;
    }

    get unit(): Unit {
        return this._unit;
    }
}