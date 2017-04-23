import * as Assets from "../assets";

export class OrderTokenService {

    private ORDER_TOKEN_WIDTH: number = 90;
    private ORDER_TOKEN_HEIGHT: number = 90;
    private map: Phaser.Tilemap;
    private orderTokens: Phaser.Group;

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

        this.orderTokens = game.add.group();
        this.orderTokens.fixedToCamera = true;

        game.add.sprite(START_WIDTH, START_HEIGHT, "orderTokens", 0, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT, "orderTokens", 1, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT, "orderTokens", 2, this.orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH ), "orderTokens", 3, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT), "orderTokens", 3, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT ), "orderTokens", 4, this.orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 2), "orderTokens", 5, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 2), "orderTokens", 5, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 2), "orderTokens", 6, this.orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3), "orderTokens", 7, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 3), "orderTokens", 7, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 3), "orderTokens", 8, this.orderTokens);

        game.add.sprite(START_WIDTH, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 4), "orderTokens", 9, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH), START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 4), "orderTokens", 9, this.orderTokens);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH) * 2, START_HEIGHT + (this.ORDER_TOKEN_HEIGHT * 4), "orderTokens", 10, this.orderTokens);

        this.orderTokens.forEach((orderToken) => {
            this.creatDragAndDrop(game, orderToken);
        }, this, false);
    }

    public addPlanningLayer(game: Phaser.Game) {
        this.map = game.add.tilemap("gotTileMap", 32, 32, 53, 94);
        let areas: Phaser.Group = game.add.group();
        this.map.objects["planninglayer"].forEach(field => {
            const fieldFront = game.add.sprite(field.x, field.y, "orderTokenFront", 0, areas);
        });
    }

    private creatDragAndDrop(game: Phaser.Game, orderToken: Phaser.Sprite) {
        orderToken.inputEnabled = true;
        orderToken.input.enableDrag();
        OrderTokenService.fixDragWhileZooming(orderToken);
        orderToken.events.onInputDown.add(function (currentSprite) {
            currentSprite.originalx = currentSprite.x;
            currentSprite.originaly = currentSprite.y;
        }, this);

        orderToken.events.onDragStop.add(function (currentSprite) {
            let matchingPosition: Phaser.Point = this.getPositionOfOverlappingArea(currentSprite);
            if (matchingPosition) {
                currentSprite.x = matchingPosition.x;
                currentSprite.y = matchingPosition.y;
                this.orderTokens.remove(currentSprite);
                currentSprite.game.add.sprite(currentSprite.x, currentSprite.y, currentSprite.key, currentSprite.frame);
            } else {
                currentSprite.x = currentSprite.originalx;
                currentSprite.y = currentSprite.originaly;
            }
        }, this);
    }

    private static fixDragWhileZooming(sprite) {

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

    public getPositionOfOverlappingArea(currentSprite): Phaser.Point {
        let matchingBounds: Phaser.Point = null;
        this.map.objects["planninglayer"].forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            var boundsA = new Phaser.Rectangle(currentSprite.position.x * scale.x, currentSprite.position.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            var relativeX = area.x - currentSprite.game.camera.x;
            var relativeY = area.y - currentSprite.game.camera.y;
            var boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
                matchingBounds = new Phaser.Point(area.x, area.y);
            }

        }, this, false);
        return matchingBounds;
    }


}