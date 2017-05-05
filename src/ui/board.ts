import * as Assets from '../assets';

export default class Board {

    private SCROLL_SPEED: number = 8;
    private zoom: number = 1;
    private zoomIncrement: number = 0.01;
    private origDragPoint: Phaser.Point = null;

    public static loadAssets(game: Phaser.Game) {
        game.load.image('gameboard', Assets.Images.ImagesMapSmall.getPNG());
    }

    public static createBoard(game: Phaser.Game) {
        const gameboard = game.add.sprite(0, 0, 'gameboard');
        game.world.setBounds(gameboard.x, gameboard.y, gameboard.width, gameboard.height);
    }

    public handleNavigationOnMap(game: Phaser.Game) {
        this.navigateUsingTwoFingersTouch(game);
        this.navigateUsingKeyboard(game);
    }

    public handleZoom(game: Phaser.Game) {

        if (game.input.keyboard.isDown(Phaser.KeyCode.Q)) {
            this.zoomIn(game.camera);
        }
        else if (game.input.keyboard.isDown(Phaser.KeyCode.Y)) {
            this.zoomOut(game.camera);
        }
    }

    private zoomIn(camera: Phaser.Camera) {
        this.zoom += this.zoomIncrement;
        camera.scale.setTo(this.zoom);
    }

    private zoomOut(camera: Phaser.Camera) {
        this.zoom -= this.zoomIncrement;
        camera.scale.setTo(this.zoom);
    }


    private navigateUsingKeyboard(game: Phaser.Game) {
        const cursors = game.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            game.camera.y -= this.SCROLL_SPEED;
        }
        else if (cursors.down.isDown) {
            game.camera.y += this.SCROLL_SPEED;
        }

        if (cursors.left.isDown) {
            game.camera.x -= this.SCROLL_SPEED;
        }
        else if (cursors.right.isDown) {
            game.camera.x += this.SCROLL_SPEED;
        }
    }

    private navigateUsingTwoFingersTouch(game: Phaser.Game) {
        if (game.input.pointer2.isDown) {
            if (this.origDragPoint) {
                // move the camera by the amount the mouse has moved since last update
                game.camera.x += this.origDragPoint.x - game.input.pointer2.position.x;
                game.camera.y += this.origDragPoint.y - game.input.pointer2.position.y;
            }
            // set new drag origin to current position
            this.origDragPoint = game.input.pointer2.position.clone();
        } else {
            this.origDragPoint = null;
        }
    }

}