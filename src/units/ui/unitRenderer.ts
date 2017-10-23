import {Area} from '../../board/logic/area';
import {House} from '../../board/logic/house';
import AssetLoader from '../../utils/assetLoader';
import Unit from '../logic/units';
import {UnitType} from '../logic/unitType';
import GameRules from '../../board/logic/gameRules/gameRules';


export default class UnitRenderer {



    private units: Phaser.Group;

    public createGroups(game: Phaser.Game) {
        this.units = game.add.group();
    }

    public renderUnits(game: Phaser.Game) {
        this.units.removeChildren();
        GameRules.gameState.areas
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