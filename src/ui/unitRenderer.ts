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
        game.load.tilemap('gotTileMap', Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);

    }

    private units: Phaser.Group;

    public renderUnits(game: Phaser.Game) {
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        if (this.units) {
            this.units.destroy(true);
        }
        this.units = game.add.group();
        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.units.length > 0 && area.units[0].getHouse() === GameState.getInstance().currentPlayer;
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