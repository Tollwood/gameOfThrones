export default class CardFunction {

    private _functionName: string;
    private _description: string;


    constructor(functionName: string, description: string) {
        this._functionName = functionName;
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    get functionName(): string {
        return this._functionName;
    }
}