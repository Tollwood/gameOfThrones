import {convertHouseToNumber, House} from '../../logic/board/house';

import {Area} from '../../logic/board/area';
import AssetLoader from '../../utils/assetLoader';
import {TSMap} from 'typescript-map';
import {gameStore} from '../../logic/board/gameState/reducer';

export default class PowerTokenRenderer {
    private powerTokenGroup: Phaser.Group;
    private controlMarkerGroup: Phaser.Group;
    private powerTokenText: TSMap<House, Phaser.Text>;

    public init(game: Phaser.Game) {
        this.powerTokenGroup = game.add.group();
        this.controlMarkerGroup = game.add.group();
        this.powerTokenText = this.addPowerToken(game);
        gameStore.subscribe(() => this.updatePowerToken());
    }

    public renderControlToken(game: Phaser.Game) {
        this.controlMarkerGroup.removeChildren();

        gameStore.getState().areas
            .filter((area: Area) => {
                return area.units.length === 0 && area.controllingHouse !== null;
            })
            .map((area: Area) => {
                let field = AssetLoader.getControlMarker().filter((areaField) => {
                    return areaField.name === area.key;
                })[0];
                game.add.sprite(field.x, field.y, this.getImageNameByHouse(area.controllingHouse), undefined, this.controlMarkerGroup);
            });

    }

    private addPowerToken(game: Phaser.Game): TSMap<House, Phaser.Text> {
        const style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
        const powerTokenText = new TSMap<House, Phaser.Text>();
        for (let player of gameStore.getState().players) {
            const cachedImage = game.cache.getImage(this.getImageNameByHouse(player.house));
            const image = game.add.image(convertHouseToNumber(player.house) * cachedImage.width, 0, this.getImageNameByHouse(player.house), undefined, this.powerTokenGroup);
            image.fixedToCamera = true;
            const text: Phaser.Text = game.add.text(convertHouseToNumber(player.house) * cachedImage.width, 0 + cachedImage.height, '', style);
            text.text = player.powerToken + '';
            text.fixedToCamera = true;
            powerTokenText.set(player.house, text);
        }
        return powerTokenText;
    }

    private updatePowerToken() {
        for (let player of gameStore.getState().players) {
            let textUi = this.powerTokenText.get(player.house);
            textUi.text = player.powerToken + '';
        }
    }

    private getImageNameByHouse(house: House): string {
        return House[house] + AssetLoader.POWER_TOKEN;
    }

}