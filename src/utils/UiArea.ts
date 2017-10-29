import {AreaKey} from '../logic/board/area';

export default class UiArea {

    constructor(height: number, name: AreaKey, width: number, x: number, y: number) {
        this._height = height;
        this._name = name;
        this._width = width;
        this._x = x;
        this._y = y;

    }

    private _height: number;
    private _name: AreaKey;
    private _width: number;
    private _x: number;
    private _y: number;

    get y(): number {
        return this._y;
    }

    get x(): number {
        return this._x;
    }

    get width(): number {
        return this._width;
    }

    get name(): AreaKey {
        return this._name;
    }

    get height(): number {
        return this._height;
    }

}