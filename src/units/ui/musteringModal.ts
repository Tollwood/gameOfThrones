import {Area} from '../../board/logic/area';
import ModalRenderer from '../../utils/modalFactory';
import {UnitType} from '../logic/unitType';
import {House} from '../../board/logic/house';
import Unit from '../logic/units';
import GameRules from '../../board/logic/gameRules';
import MusteringRenderer from './musteringRenderer';
export default class MusteringModal {

    public static showModal(game: Phaser.Game, area: Area) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Recruit new Units: ', -80, 0, true);
        this.addMusteringUnits(modal, area);

        ModalRenderer.displayModal(modal);
    }


    private static addMusteringUnits(modal: Phaser.Group, area: Area) {

        let textSkipMustering = ModalRenderer.addText(modal, 'skip mustering for this area', 100, 0, true, () => {
            GameRules.mustering(area);
            MusteringRenderer.removeChildren();
            ModalRenderer.closeFn(modal);
        });
        let textMusterUnits = ModalRenderer.addText(modal, 'Muster new units', 100, 0, true, () => {
            let unitTypesToMuster = musteringUnits.filter((mu) => {
                return mu.selected;
            }).map((mu) => {
                return mu.unitType;
            });
            GameRules.mustering(area, unitTypesToMuster);
            MusteringRenderer.removeChildren();
            ModalRenderer.closeFn(modal);
        });

        let musteringPointsText = 'mustering points left: ';

        let musteringUnits = new Array<MusteringUnit>();
        let textMusteringPoints = ModalRenderer.addText(modal, musteringPointsText + this.getRemainingMusteringPoints(area, musteringUnits), -100, 0, true);
        let availableUnitsToMuster = [UnitType.Footman, UnitType.Footman, UnitType.Horse, UnitType.Siege];
        let nextX = -110;
        availableUnitsToMuster.forEach((unitType) => {

            let musteringUnit: MusteringUnit;
            let onUnitSelectFn = () => {
                musteringUnit.selected = !musteringUnit.selected;
                this.updateModal(area, musteringUnits, textSkipMustering, textMusterUnits, textMusteringPoints, musteringPointsText);
            };

            let unit = ModalRenderer.addClickableImage(modal, House[area.controllingHouse] + UnitType[unitType], 0, nextX, onUnitSelectFn);
            musteringUnit = new MusteringUnit(unitType, unit);
            musteringUnits.push(musteringUnit);
            nextX += 50;
        });
        this.updateModal(area, musteringUnits, textSkipMustering, textMusterUnits, textMusteringPoints, musteringPointsText);
    }

    private static getRemainingMusteringPoints(area: Area, musteringUnits: MusteringUnit[]) {
        let remainingPoints = area.stronghold ? 2 : area.castle ? 1 : 0;
        musteringUnits.filter((mu) => {
            return mu.selected;
        }).forEach((musteringUnit) => {
            switch (musteringUnit.unitType) {
                case UnitType.Footman:
                    remainingPoints -= 1;
                    break;
                case UnitType.Ship:
                    remainingPoints -= 1;
                    break;
                case UnitType.Horse:
                    remainingPoints -= 2;
                    break;
                case UnitType.Siege:
                    remainingPoints -= 2;
                    break;
            }
        });
        return remainingPoints;
    }

    private static changeVisibiltyOfImages(remainingMusteringPoints: number, musteringUnits: MusteringUnit[]) {
        switch (remainingMusteringPoints) {
            case 2:
                musteringUnits.forEach((imageAndType) => {
                    imageAndType.image.visible = true;
                });
                break;
            case 1:
                let unitsRequireMoreThanOneMusteringPoint = [UnitType.Horse, UnitType.Siege];
                musteringUnits.forEach((imageAndType) => {

                    if (unitsRequireMoreThanOneMusteringPoint.indexOf(imageAndType.unitType) > -1 && !imageAndType.selected) {
                        imageAndType.image.visible = false;
                    }
                    else {
                        imageAndType.image.visible = true;
                    }
                });
                break;
            case 0:
                musteringUnits.forEach((imageAndType) => {
                    if (!imageAndType.selected) {
                        imageAndType.image.visible = false;
                    }
                    else {
                        imageAndType.image.visible = true;
                    }
                });
                break;

        }
    }

    private static updateModal(area: Area, musteringUnits: MusteringUnit[], textSkipMustering: Phaser.Text, textMusterUnits: Phaser.Text, textMusteringPoints: Phaser.Text, musteringPointsText: string) {
        let unitsSelected = musteringUnits.filter((mu) => {
                return mu.selected
            }).length > 0;
        textSkipMustering.visible = !unitsSelected;
        textMusterUnits.visible = unitsSelected;
        let remainingMusteringPoints = this.getRemainingMusteringPoints(area, musteringUnits);
        this.changeVisibiltyOfImages(remainingMusteringPoints, musteringUnits);
        textMusteringPoints.setText(musteringPointsText + remainingMusteringPoints);
    }
}

class MusteringUnit {
    private _unitType: UnitType;
    private _image: Phaser.Image;
    private _selected: boolean;

    constructor(unitType: UnitType, image: Phaser.Image, selected: boolean = false) {
        this._unitType = unitType;
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

    get unitType(): UnitType {
        return this._unitType;
    }
}