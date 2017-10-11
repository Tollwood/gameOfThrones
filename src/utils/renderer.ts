import {AreaKey} from '../board/logic/area';
import AssetLoader from './assetLoader';
export default class Renderer {

    private static _rerenderRequired = false;

    static get rerenderRequired(): boolean {
        return this._rerenderRequired;
    }

    static set rerenderRequired(value: boolean) {
        this._rerenderRequired = value;
    }

    public static drawRectangleAroundAreaName(game, areaKey: AreaKey, color: number, onInputDown: Function, group?: Phaser.Group) {
        let areaName = AssetLoader.getAreaNameByKey(areaKey);
        let graphics = game.add.graphics(0, 0, group);
        graphics.lineStyle(2, color, 1);
        graphics.beginFill(0xdfffb1, 0);
        graphics.drawRect(areaName.x, areaName.y, areaName.width, areaName.height);
        graphics.endFill();
        graphics.inputEnabled = true;
        graphics.events.onInputDown.add(onInputDown);
    }

}