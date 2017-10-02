import {House} from '../../logic/house';
import GameState from '../../logic/gameStati';
import {Area} from '../../logic/area';
import AssetLoader from '../assetLoader';

export default class PowerTokenRenderer {
    private static powerTokenGroup: Phaser.Group;
    private static controlMarkerGroup: Phaser.Group;
    private static texts: Array<Phaser.Text> = new Array();


    public static createGroups(game: Phaser.Game) {
        this.powerTokenGroup = game.add.group();
        this.controlMarkerGroup = game.add.group();
    }
    public static renderPowerToken(game: Phaser.Game) {
        this.powerTokenGroup.removeChildren();
        for (let text of this.texts) {
            text.destroy();
        }
        for (let player of GameState.getInstance().players) {
            let cachedImage = game.cache.getImage(this.getImageNameByHouse(player.house));
            let image = game.add.image(player.house * cachedImage.width, 0, this.getImageNameByHouse(player.house), undefined, this.powerTokenGroup);
            image.fixedToCamera = true;
            let style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
            let text = game.add.text(player.house * cachedImage.width, 0 + cachedImage.height, player.powerToken + '', style);
            text.fixedToCamera = true;
            this.texts.push(text);
        }
    }


    private static getImageNameByHouse(house: House): string {
        return House[house] + AssetLoader.POWER_TOKEN;
    }

    public static renderControlToken(game: Phaser.Game) {
        this.controlMarkerGroup.removeChildren();

        GameState.getInstance().areas
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
}