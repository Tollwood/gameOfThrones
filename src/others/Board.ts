import * as Assets from "../assets";

export class BoardService {

    private SCROLL_SPEED: number = 8;
    private zoom: number = 1;
    private zoomIncrement: number = 0.01;

    public static loadAssets(game: Phaser.Game) {
        game.load.image('gameboard', Assets.Images.ImagesMap.getPNG());
    }

    public static createBoard(game: Phaser.Game) {
        const gameboard = game.add.sprite(0, 0, 'gameboard');
        game.world.setBounds(gameboard.x, gameboard.y, gameboard.width, gameboard.height);
    }

    public handleNavigationOnMap(game: Phaser.Game) {
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


}