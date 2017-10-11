import CardFunction from './cardFuncttion';
export class WesterosCard {

    private _id: number;
    private _title: string;
    private _description: string;
    private _artwork: string;
    private _cardType: number;
    private _wildling: number;
    private _options: Array<CardFunction>;
    private _state: WesterosCardState;
    private _selectedFunction: CardFunction;

    constructor(id: number, title: string, description: string, artwork: string, cardType: number, wildling: number, options: Array<CardFunction>) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._artwork = artwork;
        this._cardType = cardType;
        this._wildling = wildling;
        this._options = options;
        this._state = WesterosCardState.showCard;
    }

    get options(): Array<CardFunction> {
        return this._options;
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

    get state(): WesterosCardState {
        return this._state;
    }

    set state(value: WesterosCardState) {
        this._state = value;
    }

    get selectedFunction(): CardFunction {
        return this._selectedFunction;
    }

    set selectedFunction(value: CardFunction) {
        this._selectedFunction = value;
    }
}


export enum WesterosCardState {
    showCard,
    executeCard,
    played
}