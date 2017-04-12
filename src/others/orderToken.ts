import * as Assets from "../assets";

export class OrderTokenService {

    private ORDER_TOKEN_WIDTH: number = 90;
    private ORDER_TOKEN_HEIGHT: number = 90;

    public loadAssets(game: Phaser.Game) {
        game.load.spritesheet("orderTokens", Assets.Images.ImagesOrdertokens.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 11);
        game.load.spritesheet("orderTokenFront", Assets.Images.ImagesOrderTokenFront.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
        game.load.tilemap("gotTileMap", Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);
    }

    public creatOrderTokens(game: Phaser.Game) {
        const
            ORDER_TOKEN_SPACING: number = 10,
            START_HEIGHT: number = 5,
            START_WIDTH: number = 0;

        let orderTokens: Phaser.Group = game.add.group();
        orderTokens.fixedToCamera = true;

        game.add.sprite(START_WIDTH, START_HEIGHT, "orderTokens", 0, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT, "orderTokens", 1, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT, "orderTokens", 2, orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH ), "orderTokens", 3, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT), "orderTokens", 3, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT ), "orderTokens", 4, orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 2), "orderTokens", 5, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 2), "orderTokens", 5, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 2), "orderTokens", 6, orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3), "orderTokens", 7, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 3), "orderTokens", 7, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 3), "orderTokens", 8, orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 4), "orderTokens", 9, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 4), "orderTokens", 9, orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 4), "orderTokens", 10, orderTokens);

        orderTokens.forEach((orderToken) => {
            OrderTokenService.creatDragAndDrop(game, orderToken);
        }, this, false);
    }

    public addPlanningLayer(game: Phaser.Game) {
        const map: Phaser.Tilemap = game.add.tilemap("gotTileMap", 32, 32, 53, 94);
        map.objects["planninglayer"].forEach(field => {
            const fieldFront = game.add.sprite(field.x, field.y, "orderTokenFront", 0);
            game.physics.arcade.enable(fieldFront);
        });
    }

    private static creatDragAndDrop(game: Phaser.Game, orderToken: Phaser.Sprite) {
        game.physics.arcade.enable(orderToken);
        OrderTokenService.enableDrag(orderToken);
    }

    private static enableDrag(sprite) {
        sprite.inputEnabled = true;
        sprite.input.enableDrag();
        sprite.events.onDragUpdate.add(function (sprite, pointer) {
            const pos = sprite.game.input.getLocalPosition(sprite.parent, pointer);
            if (sprite.hitArea) {
                sprite.x = pos.x - sprite.hitArea.width / 2;
                sprite.y = pos.y - sprite.hitArea.height / 2;
            } else {
                sprite.x = pos.x - sprite.width / 2;
                sprite.y = pos.y - sprite.height / 2;
            }
        }, sprite);
        return sprite;
    }


}