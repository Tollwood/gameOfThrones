export class WesterosCard {

    private _id: number;
    private _title: string;
    private _description: string;
    private _artwork: string;
    private _cardType: number;
    private _wildling: number;
    private _functions: Array<string>;

    constructor(id: number, title: string, description: string, artwork: string, cardType: number, wildling: number, functions: Array<string>) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._artwork = artwork;
        this._cardType = cardType;
        this._wildling = wildling;
        this._functions = functions;

    }

    get functions(): Array<string> {
        return this._functions;
    }

    get wildling(): number {
        return this._wildling;
    }

    get cardType(): number {
        return this._cardType;
    }

    get artwork(): string {
        return this._artwork;
    }

    get description(): string {
        return this._description;
    }

    get title(): string {
        return this._title;
    }

    get id(): number {
        return this._id;
    }

}