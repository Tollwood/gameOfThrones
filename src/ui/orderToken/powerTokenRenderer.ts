import {convertHouseToNumber, House} from '../../logic/board/house';

import {Area} from '../../logic/board/area';
import AssetLoader from '../../utils/assetLoader';
import {TSMap} from 'typescript-map';
import {gameStore} from '../../logic/board/gameState/reducer';
import {GameStoreState} from '../../logic/board/gameState/gameStoreState';

export default class PowerTokenRenderer {
    private powerTokenGroup: Phaser.Group;
    private controlMarkerGroup: Phaser.Group;
    private powerTokenText: TSMap<House, Phaser.Text>;
    private game: Phaser.Game;

    public init(game: Phaser.Game) {
        this.game = game;
        this.powerTokenGroup = game.add.group();
        this.controlMarkerGroup = game.add.group();
        gameStore.subscribe(() => {
            let state = gameStore.getState();
            if (!this.powerTokenText) {
                this.powerTokenText = this.addPowerToken(state);
            }
            this.updatePowerToken(state);
            this.renderControlToken(state);
        });
    }

    private renderControlToken(state: GameStoreState) {
        this.controlMarkerGroup.removeChildren();
        state.areas.values()
            .filter((area: Area) => {
                return area.units.length === 0 && area.controllingHouse !== null;
            })
            .map((area: Area) => {
                let field = AssetLoader.getControlMarker().filter((areaField) => {
                    return areaField.name === area.key;
                })[0];
                this.game.add.sprite(field.x, field.y, this.getImageNameByHouse(area.controllingHouse), undefined, this.controlMarkerGroup);
            });

    }

    private addPowerToken(state: GameStoreState): TSMap<House, Phaser.Text> {
        const style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
        const powerTokenText = new TSMap<House, Phaser.Text>();
        for (let player of state.players) {
            const cachedImage = this.game.cache.getImage(this.getImageNameByHouse(player.house));
            const image = this.game.add.image(convertHouseToNumber(player.house) * cachedImage.width, 0, this.getImageNameByHouse(player.house), undefined, this.powerTokenGroup);
            image.fixedToCamera = true;
            const text: Phaser.Text = this.game.add.text(convertHouseToNumber(player.house) * cachedImage.width, 0 + cachedImage.height, '', style);
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