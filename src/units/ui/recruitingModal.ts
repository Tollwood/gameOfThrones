import {Area} from '../../board/logic/area';
import ModalRenderer from '../../utils/modalFactory';
import {UnitType} from '../logic/unitType';
import {House} from '../../board/logic/house';
import GameRules from '../../board/logic/gameRules';
import RecruitingRenderer from './recruitingRenderer';
export default class RecruitingModal {

    public static showModal(game: Phaser.Game, area: Area) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Recruit new Units: ', -80, 0, true);
        this.addNewUnits(modal, area);

        ModalRenderer.displayModal(modal);
    }


    private static addNewUnits(modal: Phaser.Group, area: Area) {
        let unitsToRecruit = new Array<RecruitingUnit>();
        let recruitingPointsText = 'recruit points left: ';

        let textSkipRecruiting = ModalRenderer.addText(modal, 'skip recruit for this area', 100, 0, true, () => {
            GameRules.recruit(area);
            RecruitingRenderer.removeChildren();
            ModalRenderer.closeFn(modal);
        });
        let textRecruitNewUnits = ModalRenderer.addText(modal, 'Recruit new units', 100, 0, true, () => {
            let unitTypesToRecruit = unitsToRecruit.filter((ru) => {
                return ru.selected;
            }).map((ru) => {
                return ru.unitType;
            });
            GameRules.recruit(area, unitTypesToRecruit);
            RecruitingRenderer.removeChildren();
            ModalRenderer.closeFn(modal);
        });


        let textRecruitingPoints = ModalRenderer.addText(modal, recruitingPointsText + this.getRemainingRecruitingPoints(area, unitsToRecruit), -100, 0, true);
        let availableUnitsToRecruit = [UnitType.Footman, UnitType.Footman, UnitType.Horse, UnitType.Siege];
        let nextX = -110;
        availableUnitsToRecruit.forEach((unitType) => {

            let recruitingUnit: RecruitingUnit;
            let onUnitSelectFn = () => {
                recruitingUnit.selected = !recruitingUnit.selected;
                this.updateModal(area, unitsToRecruit, textSkipRecruiting, textRecruitNewUnits, textRecruitingPoints, recruitingPointsText);
            };

            let unit = ModalRenderer.addClickableImage(modal, House[area.controllingHouse] + UnitType[unitType], 0, nextX, onUnitSelectFn);
            recruitingUnit = new RecruitingUnit(unitType, unit);
            unitsToRecruit.push(recruitingUnit);
            nextX += 50;
        });
        this.updateModal(area, unitsToRecruit, textSkipRecruiting, textRecruitNewUnits, textRecruitingPoints, recruitingPointsText);
    }

    private static getRemainingRecruitingPoints(area: Area, unitsToRecruit: RecruitingUnit[]) {
        let remainingPoints = area.stronghold ? 2 : area.castle ? 1 : 0;
        unitsToRecruit.filter((ru) => {
            return ru.selected;
        }).forEach((ru) => {
            switch (ru.unitType) {
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

    private static changeVisibiltyOfImages(remainingRecruitingPoints: number, unitsToRecruit: RecruitingUnit[]) {
        switch (remainingRecruitingPoints) {
            case 2:
                unitsToRecruit.forEach((imageAndType) => {
                    imageAndType.image.visible = true;
                });
                break;
            case 1:
                let unitsRequireMoreThanOneRecruitingPoint = [UnitType.Horse, UnitType.Siege];
                unitsToRecruit.forEach((imageAndType) => {

                    if (unitsRequireMoreThanOneRecruitingPoint.indexOf(imageAndType.unitType) > -1 && !imageAndType.selected) {
                        imageAndType.image.visible = false;
                    }
                    else {
                        imageAndType.image.visible = true;
                    }
                });
                break;
            case 0:
                unitsToRecruit.forEach((imageAndType) => {
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

    private static updateModal(area: Area, unitsToRecruit: RecruitingUnit[], textSkipRecruiting: Phaser.Text, textRecruitingUnits: Phaser.Text, textRecruitingPoints: Phaser.Text, recruitingPointsText: string) {
        let unitsSelected = unitsToRecruit.filter((ru) => {
                return ru.selected
            }).length > 0;
        textSkipRecruiting.visible = !unitsSelected;
        textRecruitingUnits.visible = unitsSelected;
        let remainingRecruitingPoints = this.getRemainingRecruitingPoints(area, unitsToRecruit);
        this.changeVisibiltyOfImages(remainingRecruitingPoints, unitsToRecruit);
        textRecruitingPoints.setText(recruitingPointsText + remainingRecruitingPoints);
    }
}

class RecruitingUnit {
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