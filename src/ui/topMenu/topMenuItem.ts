const MENU = 'menu',
    OVERLAY = 'overlay',
    FADE_DURATION: number = 200;

export abstract class topMenuItem extends Phaser.Sprite {
    private overlay: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number, menuItem: string) {
        super(game, x, y, MENU + menuItem);
        this.fixedToCamera = true;
        this.inputEnabled = true;
        this.overlay = this.createOverlay(game, OVERLAY + menuItem, this.height);
        this.events.onInputDown.add(function () {
            this.fadeInOrOut(this.overlay)
        }.bind(this));
    }

    public createOverlay(game: Phaser.Game, imageName: string, menuHeight: number): Phaser.Sprite {
        const cameraCenter = window.innerWidth / 2;
        let overlay = game.add.sprite(0, menuHeight, imageName);
        overlay.x = cameraCenter - game.cache.getImage(imageName).width / 2;
        overlay.fixedToCamera = true;
        overlay.alpha = 0;
        return overlay;
    }

    private fadeInOrOut(sprite: Phaser.Sprite) {
        if (sprite.alpha === 0) {
            this.tween(sprite, 1);
            this.renderMarker(sprite);
        } else if (sprite.alpha === 1) {
            this.tween(sprite, 0);
            this.hideMarker(sprite);
        }
    }

    public tween(sprite: Phaser.Sprite, alpha: number) {
        sprite.game.add.tween(sprite).to({alpha: alpha}, FADE_DURATION, "Linear", true);
    }


    abstract renderMarker(overlay: Phaser.Sprite);

    abstract hideMarker(overlay: Phaser.Sprite);

    public getOverlay(): Phaser.Sprite {
        return this.overlay;
    }
}