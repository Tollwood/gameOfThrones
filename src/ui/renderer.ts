export default class Renderer {

    private static _rerenderRequired = false;

    static get rerenderRequired(): boolean {
        return this._rerenderRequired;
    }

    static set rerenderRequired(value: boolean) {
        this._rerenderRequired = value;
    }

}