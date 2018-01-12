import CardFunction from './cardFuncttion';
import {GamePhase} from '../board/gamePhase';

export class WesterosCard {

    private _id: number;
    private _title: string;
    private _description: string;
    private _artwork: string;

    constructor(id: number, title: string, description: string, artwork: string, gamePhase: GamePhase, wildling: number, options: Array<CardFunction>) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._artwork = artwork;
        this._gamePhase = gamePhase;
        this._wildling = wildling;
        this._options = options;
    }

    private _wildling: number;
    private _options: Array<CardFunction>;
    private _selectedFunction: CardFunction;

    private _gamePhase: GamePhase;

    get options(): Array<CardFunction> {
        return this._options;
    }

    get wildling(): number {
        return this._wildling;
    }

    get gamePhase(): GamePhase {
        return this._gamePhase;
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

    get selectedFunction(): CardFunction {
        return this._selectedFunction;
    }

    set selectedFunction(value: CardFunction) {
        this._selectedFunction = value;
    }
}

