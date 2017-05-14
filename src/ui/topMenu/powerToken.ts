import * as Assets from '../../assets';
import {House} from "../../logic/house";
import GameState from "../../logic/gameStati";

export default class PowerToken  {
    private static powerTokenGroup: Phaser.Group;


    public static loadAssets(game: Phaser.Game) {
         game.load.image(House[House.stark] + 'PowerToken', Assets.Images.ImagesPowerTokenStarkPowerToken.getPNG());
         game.load.image(House[House.lannister] + 'PowerToken', Assets.Images.ImagesPowerTokenLannisterPowerToken.getPNG());
         game.load.image(House[House.baratheon] + 'PowerToken', Assets.Images.ImagesPowerTokenBaratheonPowerToken.getPNG());
         game.load.image(House[House.greyjoy] + 'PowerToken', Assets.Images.ImagesPowerTokenGreyjoyPowerToken.getPNG());
         game.load.image(House[House.tyrell] + 'PowerToken', Assets.Images.ImagesPowerTokenTyrellPowerToken.getPNG());
         game.load.image(House[House.martell] + 'PowerToken', Assets.Images.ImagesPowerTokenMartellPowerToken.getPNG());
        this.powerTokenGroup = game.add.group();
    }

    public static renderPowerToken (game: Phaser.Game){
        this.powerTokenGroup.removeChildren();
        for(let player of GameState.getInstance().players){
            let cachedImage = game.cache.getImage(this.getImageNameByHouse(player.house));
            let image = game.add.image(player.house * cachedImage.width, 0 , this.getImageNameByHouse(player.house),this.powerTokenGroup);
            image.fixedToCamera = true;
            let style = {font: '28px Arial', fill: '#000000', boundsAlignH: 'right'};
            let text = game.add.text(player.house * cachedImage.width , 0 + cachedImage.height, player.powerToken+'', style);
            text.fixedToCamera = true;
        }
    }


    private static getImageNameByHouse(house: House): string {
        return House[house] + 'PowerToken';
    }

}