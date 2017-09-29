import * as Assets from '../assets';
import GameState from '../logic/gameStati';
import {Area} from '../logic/area';
import {Unit, UnitType} from '../logic/units';
import {House} from '../logic/house';


export default class UnitRenderer {
    private map: Phaser.Tilemap;

    constructor() {

    }

    public loadAssets(game: Phaser.Game) {
        game.load.image('starkFootman', Assets.Images.ImagesUnitsStarkFootman.getPNG());
        game.load.image('starkHorse', Assets.Images.ImagesUnitsStarkHorse.getPNG());
        game.load.image('starkShip', Assets.Images.ImagesUnitsStarkShip.getPNG());
        game.load.image('starkSiege', Assets.Images.ImagesUnitsStarkSiege.getPNG());

        game.load.image('lannisterFootman', Assets.Images.ImagesUnitsLannisterFootman.getPNG());
        game.load.image('lannisterHorse', Assets.Images.ImagesUnitsLannisterHorse.getPNG());
        game.load.image('lannisterShip', Assets.Images.ImagesUnitsLannisterShip.getPNG());
        game.load.image('lannisterSiege', Assets.Images.ImagesUnitsLannisterSiege.getPNG());

        game.load.image('greyjoyFootman', Assets.Images.ImagesUnitsGreyjoyFootman.getPNG());
        game.load.image('greyjoyHorse', Assets.Images.ImagesUnitsGreyjoyHorse.getPNG());
        game.load.image('greyjoyShip', Assets.Images.ImagesUnitsGreyjoyShip.getPNG());
        game.load.image('greyjoySiege', Assets.Images.ImagesUnitsGreyjoySiege.getPNG());

        game.load.image('baratheonFootman', Assets.Images.ImagesUnitsBaratheonFootman.getPNG());
        game.load.image('baratheonHorse', Assets.Images.ImagesUnitsBaratheonHorse.getPNG());
        game.load.image('baratheonShip', Assets.Images.ImagesUnitsBaratheonShip.getPNG());
        game.load.image('baratheonSiege', Assets.Images.ImagesUnitsBaratheonSiege.getPNG());

        game.load.image('tyrellFootman', Assets.Images.ImagesUnitsTyrellFootman.getPNG());
        game.load.image('tyrellHorse', Assets.Images.ImagesUnitsTyrellHorse.getPNG());
        game.load.image('tyrellShip', Assets.Images.ImagesUnitsTyrellShip.getPNG());
        game.load.image('tyrellSiege', Assets.Images.ImagesUnitsLannisterSiege.getPNG());

        game.load.image('martellFootman', Assets.Images.ImagesUnitsMartellFootman.getPNG());
        game.load.image('martellHorse', Assets.Images.ImagesUnitsMartellHorse.getPNG());
        game.load.image('martellShip', Assets.Images.ImagesUnitsMartellShip.getPNG());
        game.load.image('martellSiege', Assets.Images.ImagesUnitsLannisterSiege.getPNG());
        game.load.tilemap('gotTileMap', Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);

    }

    private units: Phaser.Group;
    private controlMarker: Phaser.Group;

    public createGroups(game: Phaser.Game) {
        this.controlMarker = game.add.group();
        this.units = game.add.group();
    }

    public renderUnits(game: Phaser.Game) {
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        this.units.removeChildren();
        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.units.length > 0;
            })
            .map((area: Area) => {
                let field = this.map.objects['units'].find((areaField) => {
                    return areaField.name === area.key;
                });
                let nextX = field.x;
                area.units.map((unit: Unit) => {
                    this.units.add(new Phaser.Sprite(game, nextX, field.y, House[unit.getHouse()] + UnitType[unit.getType()]));
                    nextX += 20;
                });

            });
    }
}