import * as Assets from '../../assets';
import {House} from '../../logic/house';
import GameState from '../../logic/gameStati';
import {Area} from '../../logic/area';

export default class PowerToken {
    private static powerTokenGroup: Phaser.Group;
    private static controlMarkerGroup: Phaser.Group;
    private static texts: Array<Phaser.Text>;

    public static loadAssets(game: Phaser.Game) {
        game.load.image(House[House.stark] + 'PowerToken', Assets.Images.ImagesPowerTokenStarkPowerToken.getPNG());
        game.load.image(House[House.lannister] + 'PowerToken', Assets.Images.ImagesPowerTokenLannisterPowerToken.getPNG());
        game.load.image(House[House.baratheon] + 'PowerToken', Assets.Images.ImagesPowerTokenBaratheonPowerToken.getPNG());
        game.load.image(House[House.greyjoy] + 'PowerToken', Assets.Images.ImagesPowerTokenGreyjoyPowerToken.getPNG());
        game.load.image(House[House.tyrell] + 'PowerToken', Assets.Images.ImagesPowerTokenTyrellPowerToken.getPNG());
        game.load.image(House[House.martell] + 'PowerToken', Assets.Images.ImagesPowerTokenMartellPowerToken.getPNG());
        this.powerTokenGroup = game.add.group();
        this.controlMarkerGroup = game.add.group();
        this.texts = new Array<Phaser.Text>();
    }

    public static renderPowerToken(game: Phaser.Game) {
        this.powerTokenGroup.removeChildren();
        for (let text of this.texts) {
            text.destroy();
        }
        for (let player of GameState.getInstance().players) {
            let cachedImage = game.cache.getImage(this.getImageNameByHouse(player.house));
            let image = game.add.image(player.house * cachedImage.width, 0, this.getImageNameByHouse(player.house), this.powerTokenGroup);
            image.fixedToCamera = true;
            let style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
            let text = game.add.text(player.house * cachedImage.width, 0 + cachedImage.height, player.powerToken + '', style);
            text.fixedToCamera = true;
            this.texts.push(text);
        }
    }


    private static getImageNameByHouse(house: House): string {
        return House[house] + 'PowerToken';
    }

    public static renderControlToken(game: Phaser.Game) {
        let map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        this.controlMarkerGroup.removeChildren();

        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.units.length === 0 && area.controllingHouse !== null;
            })
            .map((area: Area) => {
                let field = map.objects['controlMarker'].find((areaField) => {
                    return areaField.name === area.key;
                });
                game.add.image(field.x, field.y, this.getImageNameByHouse(area.controllingHouse), this.controlMarkerGroup);
            });

    }
}