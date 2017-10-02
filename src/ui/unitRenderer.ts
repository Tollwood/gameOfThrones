import GameState from '../logic/gameStati';
import {Area} from '../logic/area';
import {Unit, UnitType} from '../logic/units';
import {House} from '../logic/house';
import AssetLoader from './assetLoader';


export default class UnitRenderer {



    private units: Phaser.Group;

    public createGroups(game: Phaser.Game) {
        this.units = game.add.group();
    }

    public renderUnits(game: Phaser.Game) {
        this.units.removeChildren();
        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.units.length > 0;
            })
            .map((area: Area) => {
                let field = AssetLoader.getUnits().filter((areaField) => {
                    return areaField.name === area.key;
                })[0];
                let nextX = field.x;
                area.units.map((unit: Unit) => {
                    this.units.add(new Phaser.Sprite(game, nextX, field.y, House[unit.getHouse()] + UnitType[unit.getType()]));
                    nextX += 20;
                });

            });
    }
}