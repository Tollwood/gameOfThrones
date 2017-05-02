import * as Assets from "../assets";
import {GameState} from "../logic/gameStati";
import {Area} from "../logic/area";
import {Unit, UnitType, House} from "../logic/units";


export class UnitRenderer {
    private map: Phaser.Tilemap;

    constructor() {

    }

    public loadAssets(game: Phaser.Game) {
        game.load.image('starkFootman', Assets.Images.ImagesUnitsStarkFootman.getPNG());
        game.load.image('starkHorse', Assets.Images.ImagesUnitsStarkHorse.getPNG());
        game.load.image('starkShip', Assets.Images.ImagesUnitsStarkShip.getPNG());
        game.load.image('starkSiege', Assets.Images.ImagesUnitsStarkSiege.getPNG());
        game.load.tilemap("gotTileMap", Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);

    }

    private units: Phaser.Group;

    public renderUnits(game: Phaser.Game) {
        this.map = game.add.tilemap("gotTileMap", 32, 32, 53, 94);
        if (this.units) {
            this.units.destroy(true);
        }
        this.units = game.add.group();
        GameState.getInstance().getAreas()
            .filter((area: Area) => {
                return area.getUnits().length > 0;
            })
            .map((area: Area) => {
                let field = this.map.objects["units"].find((areaField) => {
                    return areaField.name === area.getKey();
                });
                let nextX = field.x;
                area.units.map((unit: Unit) => {
                    this.units.add(new Phaser.Sprite(game, nextX, field.y, House[unit.getHouse()] + UnitType[unit.getType()]));
                    nextX += 20;
                });

            });
    }
}