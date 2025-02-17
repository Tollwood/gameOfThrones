import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {ActionFactory, Area, AreaStatsService, GameLogic, House, StateSelectorService, UnitType} from 'got-store';
import Modal from '../../../utils/modal';
import Renderer from '../../../utils/renderer';

export default class RecruitingModal extends Modal {

  constructor(gameLogic: GameLogic, renderer: Renderer, area: Area, closeFn: Function) {
        super(renderer);
        this.addText('Recruit new Units: ', -80, 0, true);
    this.addNewUnits(gameLogic, area, closeFn);

    }


  private addNewUnits(gameLogic: GameLogic, area: Area, closeFn: Function) {
        let unitsToRecruit: RecruitingUnit[] = [];
        let recruitingPointsText = 'recruit points left: ';

        let textSkipRecruiting = this.addText('skip recruit for this area', 100, 0, true, () => {
            closeFn();
            this.close();
          gameLogic.execute(ActionFactory.recruitUnits(area.key));
        });
        let textRecruitNewUnits = this.addText('Recruit new units', 100, 0, true, () => {
            let unitTypesToRecruit = unitsToRecruit.filter((ru) => {
                return ru.selected;
            }).map((ru) => {
                return ru.unitType;
            });
            closeFn();
            this.close();
          gameLogic.execute(ActionFactory.recruitUnits(area.key, unitTypesToRecruit));
        });


        let textRecruitingPoints = this.addText(recruitingPointsText + this.getRemainingRecruitingPoints(area, unitsToRecruit), -100, 0, true);
        let availableUnitsToRecruit = [UnitType.Footman, UnitType.Footman, UnitType.Horse, UnitType.Siege];
        let nextX = -110;
        availableUnitsToRecruit.forEach((unitType) => {

            let recruitingUnit: RecruitingUnit;
            let onUnitSelectFn = () => {
                recruitingUnit.selected = !recruitingUnit.selected;
              this.updateModal(gameLogic, area, unitsToRecruit, textSkipRecruiting, textRecruitNewUnits, textRecruitingPoints, recruitingPointsText);
            };

            let unit = this.addClickableImage(House[area.controllingHouse] + UnitType[unitType], 0, nextX, onUnitSelectFn);
            recruitingUnit = new RecruitingUnit(unitType, unit);
            unitsToRecruit.push(recruitingUnit);
            nextX += 50;
        });
    this.updateModal(gameLogic, area, unitsToRecruit, textSkipRecruiting, textRecruitNewUnits, textRecruitingPoints, recruitingPointsText);
    }

    private  getRemainingRecruitingPoints(area: Area, unitsToRecruit: RecruitingUnit[]) {
        const areaStats = AreaStatsService.getInstance().areaStats.get(area.key);
        let remainingPoints = areaStats.stronghold ? 2 : areaStats.castle ? 1 : 0;
        unitsToRecruit.filter((ru) => {
            return ru.selected;
        }).forEach((ru) => {
            // TODO Recruiting costs should be outside of the modal
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

    private  changeVisibiltyOfImages(remainingRecruitingPoints: number, unitsToRecruit: RecruitingUnit[]) {
        switch (remainingRecruitingPoints) {
            case 2:
                unitsToRecruit.forEach((imageAndType) => {
                    imageAndType.image.visible = true;
                });
                break;
            case 1:
                let unitsRequireMoreThanOneRecruitingPoint = [UnitType.Horse, UnitType.Siege];
                unitsToRecruit.forEach((imageAndType) => {
                    imageAndType.image.visible = !(unitsRequireMoreThanOneRecruitingPoint.indexOf(imageAndType.unitType) > -1 && !imageAndType.selected);
                });
                break;
            case 0:
                unitsToRecruit.forEach((imageAndType) => {
                    imageAndType.image.visible = imageAndType.selected;
                });
                break;
        }
    }

  private updateModal(gameLogic: GameLogic, area: Area, unitsToRecruit: RecruitingUnit[], textSkipRecruiting: Phaser.Text, textRecruitingUnits: Phaser.Text, textRecruitingPoints: Phaser.Text, recruitingPointsText: string) {
        let numOfSelectedUnits = unitsToRecruit.filter((unit) => {
            return unit.selected === true;
        }).length;
        let unitsSelected = numOfSelectedUnits > 0;
        textSkipRecruiting.visible = !unitsSelected;
        textRecruitingUnits.visible = unitsSelected;
        let remainingRecruitingPoints = this.getRemainingRecruitingPoints(area, unitsToRecruit);
    let maxArmySize = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(gameLogic.getState(), gameLogic.getState().currentHouse);
        if (area.units.length + numOfSelectedUnits === maxArmySize) {
            remainingRecruitingPoints = 0;
        }
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
