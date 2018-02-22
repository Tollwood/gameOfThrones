import {Area, GameStoreState, House} from 'got-store';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import AssetLoader from '../../../utils/assetLoader';
import {Store} from 'redux';
import Renderer from '../../../utils/renderer';

export default class PowerTokenRenderer {
    private powerTokenGroup: Phaser.Group;
    private controlMarkerGroup: Phaser.Group;
    private powerTokenText: Map<House, Phaser.Text>;
  private _renderer: Renderer;

  public init(store: Store<GameStoreState>, renderer: Renderer) {
    this._renderer = renderer;
    this.powerTokenGroup = this._renderer.game.add.group();
    this.controlMarkerGroup = this._renderer.game.add.group();
    store.subscribe(() => {
      let state = store.getState();
            if (!this.powerTokenText) {
                this.powerTokenText = this.addPowerToken(state);
            }
            this.updatePowerToken(state);
            this.renderControlToken(state);
        });
    }

    private renderControlToken(state: GameStoreState) {
        this.controlMarkerGroup.removeChildren();
      Array.from(state.areas.values())
            .filter((area: Area) => {
                return area.units.length === 0 && area.controllingHouse !== null;
            })
            .map((area: Area) => {
                let field = AssetLoader.getControlMarker().filter((areaField) => {
                    return areaField.name === area.key;
                })[0];
              this._renderer.game.add.sprite(field.x, field.y, this.getImageNameByHouse(area.controllingHouse), undefined, this.controlMarkerGroup);
            });

    }

    private addPowerToken(state: GameStoreState): Map<House, Phaser.Text> {
        const style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
        const powerTokenText = new Map<House, Phaser.Text>();
        for (let player of state.players) {
          const cachedImage = this._renderer.game.cache.getImage(this.getImageNameByHouse(player.house));
          const image = this._renderer.game.add.image(this._renderer.convertHouseToNumber(player.house) * cachedImage.width, 0, this.getImageNameByHouse(player.house), undefined, this.powerTokenGroup);
            image.fixedToCamera = true;
          const text: Phaser.Text = this._renderer.game.add.text(this._renderer.convertHouseToNumber(player.house) * cachedImage.width, 0 + cachedImage.height, '', style);
            text.text = player.powerToken + '';
            text.fixedToCamera = true;
            powerTokenText.set(player.house, text);
        }
        return powerTokenText;
    }

    private updatePowerToken(state: GameStoreState) {
        for (let player of state.players) {
            let textUi = this.powerTokenText.get(player.house);
            textUi.text = player.powerToken + '';
        }
    }

    private getImageNameByHouse(house: House): string {
        return House[house] + AssetLoader.POWER_TOKEN;
    }

}
