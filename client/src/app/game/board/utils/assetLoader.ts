import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import UiArea from './UiArea';
import {AreaKey, House, UnitType} from 'got-store';

export default class AssetManager {

  static ORDER_TOKENS = 'orderTokens';
  static ORDER_TOKENS_FRONT = 'orderTokensFront';
  static ORDER_TOKEN_MENU_BACKGROUND = 'orderTokensMenuBackground';
  static GAME_BOARD: string = 'gameboard';
  static POWER_TOKEN = 'powerToken';

  private static PATH_TO_IMAGE = 'assets/images/';
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
    game.load.image(this.GAME_BOARD, this.PATH_TO_IMAGE + 'mapSmall.png');
    game.load.spritesheet(this.ORDER_TOKENS, this.PATH_TO_IMAGE + 'orderToken/ordertokens45.png', this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT);
    game.load.spritesheet(this.ORDER_TOKENS_FRONT, this.PATH_TO_IMAGE + 'orderToken/orderTokenFront45.png', this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
    game.load.tilemap(this.GOT_TILE_MAP, 'assets/tilemap/gameOfThrones.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image(this.ORDER_TOKEN_MENU_BACKGROUND, this.PATH_TO_IMAGE + 'orderToken/menubackground.png');
    this.loadUnits(game);
    this.loadPowerToken(game);
    this.loadWesterosCards(game);

  }

  public static createAssets(game: Phaser.Game) {

    let map = game.add.tilemap(this.GOT_TILE_MAP, 32, 32, 53, 94);
    this.areaNames = map.objects['areaNames'].map((area) => {
      return new UiArea(area.height, AreaKey[<string>area.name], area.width, area.x, area.y);
    });
    this.areaTokens = map.objects['planninglayer'].map((area) => {
      return new UiArea(area.height, AreaKey[<string>area.name], area.height, area.x, area.y);
    });
    this.controlMarker = map.objects['controlMarker'].map((area) => {
      return new UiArea(area.height, AreaKey[<string>area.name], area.height, area.x, area.y);
    });
    this.units = map.objects['units'].map((area) => {
      return new UiArea(area.height, AreaKey[<string>area.name], area.height, area.x, area.y);
    });
  }

  private static loadUnits(game: Phaser.Game) {
    game.load.image(House[House.stark] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/starkFootman.png');
    game.load.image(House[House.stark] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/starkHorse.png');
    game.load.image(House[House.stark] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/starkShip.png');
    game.load.image(House[House.stark] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/starkSiege.png');

    game.load.image(House[House.lannister] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/LannisterFootman.png');
    game.load.image(House[House.lannister] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/LannisterHorse.png');
    game.load.image(House[House.lannister] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/LannisterShip.png');
    game.load.image(House[House.lannister] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/LannisterSiege.png');

    game.load.image(House[House.greyjoy] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/greyjoyFootman.png');
    game.load.image(House[House.greyjoy] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/greyjoyHorse.png');
    game.load.image(House[House.greyjoy] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/greyjoyShip.png');
    game.load.image(House[House.greyjoy] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/greyjoySiege.png');

    game.load.image(House[House.baratheon] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/BaratheonFootman.png');
    game.load.image(House[House.baratheon] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/BaratheonHorse.png');
    game.load.image(House[House.baratheon] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/BaratheonShip.png');
    game.load.image(House[House.baratheon] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/BaratheonSiege.png');

    game.load.image(House[House.tyrell] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/TyrellFootman.png');
    game.load.image(House[House.tyrell] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/TyrellHorse.png');
    game.load.image(House[House.tyrell] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/TyrellShip.png');
    game.load.image(House[House.tyrell] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/LannisterSiege.png');

    game.load.image(House[House.martell] + UnitType[UnitType.Footman], this.PATH_TO_IMAGE + 'unit/MartellFootman.png');
    game.load.image(House[House.martell] + UnitType[UnitType.Horse], this.PATH_TO_IMAGE + 'unit/MartellHorse.png');
    game.load.image(House[House.martell] + UnitType[UnitType.Ship], this.PATH_TO_IMAGE + 'unit/MartellShip.png');
    game.load.image(House[House.martell] + UnitType[UnitType.Siege], this.PATH_TO_IMAGE + 'unit/LannisterSiege.png');
  }

  private static loadPowerToken(game: Phaser.Game) {
    game.load.image(House[House.stark] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/StarkPowerToken.png');
    game.load.image(House[House.lannister] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/LannisterPowerToken.png');
    game.load.image(House[House.baratheon] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/BaratheonPowerToken.png');
    game.load.image(House[House.greyjoy] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/GreyjoyPowerToken.png');
    game.load.image(House[House.tyrell] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/TyrellPowerToken.png');
    game.load.image(House[House.martell] + this.POWER_TOKEN, this.PATH_TO_IMAGE + 'powerToken/MartellPowerToken.png');

  }

  private static loadWesterosCards(game: Phaser.Game) {
    game.load.image('wildlingsSymbol', this.PATH_TO_IMAGE + 'westerosCard/wildlingsSymbol.png');
    game.load.image('WESTEROS1', this.PATH_TO_IMAGE + 'westerosCard/WESTEROS1.png');
    game.load.image('WESTEROS2', this.PATH_TO_IMAGE + 'westerosCard/WESTEROS2.png');
    game.load.image('WESTEROS3', this.PATH_TO_IMAGE + 'westerosCard/WESTEROS3.png');
    game.load.image('winterIsComming', this.PATH_TO_IMAGE + 'westerosCard/winterIsComming.png');
    game.load.image('aThroneMadeOfSwords', this.PATH_TO_IMAGE + 'westerosCard/aThroneMadeOfSwords.png');
    game.load.image('supply', this.PATH_TO_IMAGE + 'westerosCard/supply.png');
    game.load.image('recruit', this.PATH_TO_IMAGE + 'westerosCard/recruit.png');
    game.load.image('lastDaysOfSummer', this.PATH_TO_IMAGE + 'westerosCard/lastDaysOfSummer.png');
    game.load.image('gameOfThrones', this.PATH_TO_IMAGE + 'westerosCard/gameOfThrones.png');
    game.load.image('royalFeud', this.PATH_TO_IMAGE + 'westerosCard/royalFeud.png');
    game.load.image('darkWingsDarkWords', this.PATH_TO_IMAGE + 'westerosCard/darkWingsDarkWords.png');
    game.load.image('letTheSwordSpeak', this.PATH_TO_IMAGE + 'westerosCard/letTheSwordSpeak.png');
    game.load.image('stormySea', this.PATH_TO_IMAGE + 'westerosCard/stormySea.png');
    game.load.image('feastOfCrows', this.PATH_TO_IMAGE + 'westerosCard/feastOfCrows.png');
    game.load.image('autumnrain', this.PATH_TO_IMAGE + 'westerosCard/autumnrain.png');
    game.load.image('wildlingsattack', this.PATH_TO_IMAGE + 'westerosCard/wildlingsattack.png');
    game.load.image('letTheSwordSpeak', this.PATH_TO_IMAGE + 'westerosCard/letTheSwordSpeak.png');
    game.load.image('liesAndIntrigue', this.PATH_TO_IMAGE + 'westerosCard/liesAndIntrigue.png');
  }
}
