import {Area} from '../../logic/board/area';
import {House} from '../../logic/board/house';
import AssetLoader from '../../utils/assetLoader';
import Unit from '../../logic/units/units';
import {UnitType} from '../../logic/units/unitType';
import {gameStore} from '../../logic/board/gameState/reducer';


export default class UnitRenderer {



    private units: Phaser.Group;

    public createGroups(game: Phaser.Game) {
        this.units = game.add.group();
    }

    public renderUnits(game: Phaser.Game) {
        this.units.removeChildren();
        gameStore.getState().areas
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