import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {Area, GameLogic, House, State, Unit, UnitType} from 'got-store';
import AssetLoader from '../../../utils/assetLoader';
import Renderer from '../../../utils/renderer';


export default class UnitRenderer {

  private units: Phaser.Group;
  private renderer: Renderer;

  public init(store: GameLogic, renderer: Renderer) {
    this.renderer = renderer;
    this.units = renderer.game.add.group();
    this.renderUnits(store.getState());
    store.subscribe(() => {
      this.renderUnits(store.getState());
    });
  }

  public renderUnits(state: State) {
    this.units.removeChildren();
    Array.from(state.areas.values())
      .filter((area: Area) => {
        return area.units.length > 0;
      })
      .map((area: Area) => {
        let field = AssetLoader.getUnits().filter((areaField) => {
          return areaField.name === area.key;
        })[0];
        let nextX = field.x;
        area.units.map((unit: Unit) => {
          const houseNumnber = this.renderer.convertHouseToNumber(unit.getHouse());
          const cal = (houseNumnber * 4) + this.renderer.convertUnitTypeToNumber(unit.getType());
          const frame: number = cal < 4 ? cal : cal - 1;
          this.renderer.game.add.sprite(nextX, field.y, AssetLoader.UNITS, frame, this.units);
          nextX += 20;
        });
      });
  }
}
