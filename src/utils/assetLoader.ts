import * as Assets from '../assets';
import UiArea from './UiArea';
import {House} from '../logic/board/house';
import {AreaKey} from '../logic/board/area';
import {UnitType} from '../logic/units/unitType';

export default class AssetManager {

    static ORDER_TOKENS = 'orderTokens';
    static ORDER_TOKENS_FRONT = 'orderTokensFront';
    static ORDER_TOKEN_MENU_BACKGROUND = 'orderTokensMenuBackground';
    static GAME_BOARD: string = 'gameboard';
    static POWER_TOKEN = 'powerToken';

    private static GOT_TILE_MAP = 'gotTileMap';

    private static ORDER_TOKEN_WIDTH: number = 45;
    private static ORDER_TOKEN_HEIGHT: number = 45;

    private static areaNames: Array<UiArea>;
    private static areaTokens: Array<UiArea>;
    private static controlMarker: Array<UiArea>;
    private static units: Array<UiArea>;

    public static getAreaTokens(): Array<UiArea> {
        return this.areaTokens;
    }

    public static getAreaTokenByKey(key: AreaKey): UiArea {
        return this.getAreaTokens().filter((uiArea) => {
            return uiArea.name === key;
        })[0];
    }

    public static getAreaNameByKey(key: AreaKey): UiArea {
        return this.getAreaNames().filter((uiArea) => {
            return uiArea.name === key;
        })[0];
    }
    public static getAreaNames(): Array<UiArea> {
        return this.areaNames;
    }

    public static getControlMarker(): Array<UiArea> {
        return this.controlMarker;
    }

    public static getUnits(): Array<UiArea> {
        return this.units;
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(this.GAME_BOARD, Assets.Images.ImagesMapSmall.getPNG());
        game.load.spritesheet(this.ORDER_TOKENS, Assets.Images.ImagesOrderTokenOrdertokens45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT);
        game.load.spritesheet(this.ORDER_TOKENS_FRONT, Assets.Images.ImagesOrderTokenOrderTokenFront45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
        game.load.tilemap(this.GOT_TILE_MAP, Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);
        game.load.image(this.ORDER_TOKEN_MENU_BACKGROUND, Assets.Images.ImagesOrderTokenMenubackground.getPNG());
        this.loadUnits(game);
        this.loadPowerToken(game);

    }

    public static createAssets(game: Phaser.Game) {
        let map = game.add.tilemap(this.GOT_TILE_MAP, 32, 32, 53, 94);
        this.areaNames = map.objects['areaNames'].map((area) => {
            return new UiArea(area.height, area.name, area.width, area.x, area.y);
        });
        this.areaTokens = map.objects['planninglayer'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });
        this.controlMarker = map.objects['controlMarker'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });
        this.units = map.objects['units'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });
    }

    private static loadUnits(game: Phaser.Game) {
        game.load.image(House[House.stark] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitStarkFootman.getPNG());
        game.load.image(House[House.stark] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitStarkHorse.getPNG());
        game.load.image(House[House.stark] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitStarkShip.getPNG());
        game.load.image(House[House.stark] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitStarkSiege.getPNG());

        game.load.image(House[House.lannister] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitLannisterFootman.getPNG());
        game.load.image(House[House.lannister] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitLannisterHorse.getPNG());
        game.load.image(House[House.lannister] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitLannisterShip.getPNG());
        game.load.image(House[House.lannister] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitLannisterSiege.getPNG());

        game.load.image(House[House.greyjoy] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitGreyjoyFootman.getPNG());
        game.load.image(House[House.greyjoy] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitGreyjoyHorse.getPNG());
        game.load.image(House[House.greyjoy] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitGreyjoyShip.getPNG());
        game.load.image(House[House.greyjoy] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitGreyjoySiege.getPNG());

        game.load.image(House[House.baratheon] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitBaratheonFootman.getPNG());
        game.load.image(House[House.baratheon] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitBaratheonHorse.getPNG());
        game.load.image(House[House.baratheon] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitBaratheonShip.getPNG());
        game.load.image(House[House.baratheon] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitBaratheonSiege.getPNG());

        game.load.image(House[House.tyrell] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitTyrellFootman.getPNG());
        game.load.image(House[House.tyrell] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitTyrellHorse.getPNG());
        game.load.image(House[House.tyrell] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitTyrellShip.getPNG());
        game.load.image(House[House.tyrell] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitLannisterSiege.getPNG());

        game.load.image(House[House.martell] + UnitType[UnitType.Footman], Assets.Images.ImagesUnitMartellFootman.getPNG());
        game.load.image(House[House.martell] + UnitType[UnitType.Horse], Assets.Images.ImagesUnitMartellHorse.getPNG());
        game.load.image(House[House.martell] + UnitType[UnitType.Ship], Assets.Images.ImagesUnitMartellShip.getPNG());
        game.load.image(House[House.martell] + UnitType[UnitType.Siege], Assets.Images.ImagesUnitLannisterSiege.getPNG());
    }

    private static loadPowerToken(game: Phaser.Game) {
        game.load.image(House[House.stark] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenStarkPowerToken.getPNG());
        game.load.image(House[House.lannister] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenLannisterPowerToken.getPNG());
        game.load.image(House[House.baratheon] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenBaratheonPowerToken.getPNG());
        game.load.image(House[House.greyjoy] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenGreyjoyPowerToken.getPNG());
        game.load.image(House[House.tyrell] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenTyrellPowerToken.getPNG());
        game.load.image(House[House.martell] + this.POWER_TOKEN, Assets.Images.ImagesPowerTokenMartellPowerToken.getPNG());
    }

}
