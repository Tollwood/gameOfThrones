import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import AssetLoader from './assetLoader';
import {Area, AreaKey, GameLogic, House, OrderTokenType} from 'got-store';
import UiArea from './UiArea';
import RecruitingModal from '../states/game/units/recruitingModal';
import UiInteractionSupport from './uiInteractionSupport';
import {UnitType} from 'got-store/dist';

export default class Renderer {

  private _game: Phaser.Game;

  get game(): Phaser.Game {
    return this._game;
  }

  get placedTokens(): Phaser.Group {
    return this._placedTokens;
  }

  constructor(game: Phaser.Game) {
    this._game = game;
  }

  public map: Phaser.Group;
  public areaOverlay: Phaser.Group;
  private placableOrderTokens: Phaser.Group;
  private selectedTokenMarker: Phaser.Group;
  private _placedTokens: Phaser.Group;
  public validAreasToExecuteOrderToken: Phaser.Group;
  public areasToPlaceToken: Phaser.Group;
  public areasToRecruit: Phaser.Group;
  public orderTokenMenu: Phaser.TileSprite;

  public initGameLayers() {
    this.map = this._game.add.group();
    this.areaOverlay = this._game.add.group();
    this.areasToRecruit = this._game.add.group();
    this.areasToPlaceToken = this._game.add.group();
    this.selectedTokenMarker = this._game.add.group();
    this._placedTokens = this._game.add.group();
    this.validAreasToExecuteOrderToken = this._game.add.group();
    this.orderTokenMenu = this.drawOrderTokenMenuBackground(this._game, false);
    this.placableOrderTokens = this._game.add.group();

  }

  // draw things
  public drawRectangleAroundAreaName(areaKey: AreaKey, color: number, onInputDown: Function, group?: Phaser.Group) {
    let areaName = AssetLoader.getAreaNameByKey(areaKey);
    let graphics = this._game.add.graphics(0, 0, group);
    graphics.lineStyle(2, color, 1);
    graphics.beginFill(0xdfffb1, 0);
    graphics.drawRect(areaName.x, areaName.y, areaName.width, areaName.height);
    graphics.endFill();
    graphics.inputEnabled = true;
    graphics.events.onInputDown.add(onInputDown);
  }

  public addSprite(areaKey: AreaKey, key, frame, group: Phaser.Group) {
    let areaToken: UiArea = AssetLoader.getAreaTokenByKey(areaKey);
    return this._game.add.sprite(areaToken.x + (areaToken.width / 2), areaToken.y + (areaToken.height / 2), key, frame, group);
  }

  public highlightToken(areaKey: AreaKey) {
    this.selectedTokenMarker.removeChildren();
    const area = AssetLoader.getAreaTokenByKey(areaKey);
    const graphics = this._game.add.graphics(0, 0, this.selectedTokenMarker);
    graphics.beginFill(0x00FF00, 1);
    graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
  }

  public showRecruitingModal(gameLogic: GameLogic, area: Area) {
    let modal = new RecruitingModal(gameLogic, this, area, () => this.areasToRecruit.removeChildren());
    modal.show();
  }

  public removeSelectedToken() {
    this.selectedTokenMarker.removeChildren();
    this.validAreasToExecuteOrderToken.removeChildren();
  }

  public hidePlaceAbleOrderToken() {
    this.orderTokenMenu.visible = false;
    this.placableOrderTokens.removeChildren();
  }

  public displayOrderTokenInMenu(availableOrderToken: OrderTokenType[], placeOrderTokenFn: Function) {
    this.orderTokenMenu.visible = true;
    this.placableOrderTokens.removeChildren();
    this.placableOrderTokens.createMultiple(1, AssetLoader.ORDER_TOKENS, availableOrderToken, true);
    this.placableOrderTokens.align(0, 0, 50, 45);
    this.placableOrderTokens.fixedToCamera = true;
    this.placableOrderTokens.cameraOffset.x = 10;
    this.placableOrderTokens.cameraOffset.y = this._game.height - 55;
    this.placableOrderTokens.forEach((orderToken) => {
      UiInteractionSupport.createDragAndDrop(orderToken, placeOrderTokenFn);
    }, this, false);
  }

    private drawOrderTokenMenuBackground(game: Phaser.Game, visible: boolean): Phaser.TileSprite {
        let menu = game.add.tileSprite(0, game.height - 60, 50 * 15 + 10, game.height, AssetLoader.ORDER_TOKEN_MENU_BACKGROUND, 0);
        menu.fixedToCamera = true;
        menu.cameraOffset.y = game.height - 60;
        menu.visible = true;
        return menu;
    }

  public convertHouseToNumber(house: House): number {
    switch (house) {
      case House.stark:
        return 0;
      case House.baratheon:
        return 1;
      case House.lannister:
        return 2;
      case House.greyjoy:
        return 3;
      case House.martell:
        return 4;
      case House.tyrell:
        return 5;
    }
  }

  public convertUnitTypeToNumber(unitType: UnitType): number {
    switch (unitType) {
      case UnitType.Footman:
        return 1;
      case UnitType.Horse:
        return 2;
      case UnitType.Siege:
        return 3;
      case UnitType.Ship:
        return 4;
    }
  }
}
