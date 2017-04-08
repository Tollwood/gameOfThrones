import * as Assets from '../assets';

export default class Title extends Phaser.State {
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private googleFontText: Phaser.Text = null;

    public create(): void {
        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, Assets.Images.ImagesHouseBaratheon.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX - 100 , this.game.world.centerY - 100, Assets.Images.ImagesHouseGreyjoy.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX + 100 , this.game.world.centerY - 100, Assets.Images.ImagesHouseTyrell.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, Assets.Images.ImagesHouseLannister.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX - 100 , this.game.world.centerY + 100, Assets.Images.ImagesHouseMartell.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX + 100 , this.game.world.centerY + 100, Assets.Images.ImagesHouseStark.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.game.camera.flash(0x000000, 1000);
    }
}
