import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {Area, GameStoreState, House, Unit, UnitType} from 'got-store';
import AssetLoader from '../../../utils/assetLoader';
import {Store} from 'redux';


export default class UnitRenderer {

  private units: Phaser.Group;
  private game: Phaser.Game;

  public init(store: Store<GameStoreState>, game: Phaser.Game) {
    this.game = game;
    this.units = game.add.group();
    store.subscribe(() => {
      this.renderUnits(store.getState());
    });
  }

  public renderUnits(state: GameStoreState) {
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
          this.units.add(new Phaser.Sprite(this.game, nextX, field.y, House[unit.getHouse()] + UnitType[unit.getType()]));
          nextX += 20;
        });
      });
  }
}
