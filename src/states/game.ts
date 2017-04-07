import * as Assets from '../assets';

export default class Game extends Phaser.State {
    private card: Phaser.Sprite;
    private cursors: Phaser.CursorKeys;
    private scrollSpeed: number;


    private zoom: number;
    private zoomIncrement: number;
    private zoomInKey: Phaser.Key;
    private zoomOutKey: Phaser.Key;

    public preload() {
        this.game.load.image('gameboard', Assets.Images.ImagesMap.getPNG());
        this.game.load.image('card', Assets.Images.ImagesHouseStark.getPNG());

    }

    public create(): void {
        this.scrollSpeed = 8;
        this.zoom = 1;
        this.zoomIncrement = 0.01;

        const gameboard = this.game.add.sprite(0, 0, 'gameboard');

        this.game.world.setBounds(gameboard.x, gameboard.y, gameboard.width, gameboard.height );

        this.card = this.game.add.sprite(200, 200, 'card');

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.zoomInKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.zoomInKey.onDown.add(this.zoomIn, this);

        this.zoomOutKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Y);
        this.zoomOutKey.onDown.add(this.zoomOut, this);

    }

    public update() {
        this.game.input.enabled = true;
        if (this.cursors.up.isDown) {
            this.game.camera.y -= this.scrollSpeed;
        }
        else if (this.cursors.down.isDown) {
            this.game.camera.y += this.scrollSpeed;
        }

        if (this.cursors.left.isDown) {
            this.game.camera.x -= this.scrollSpeed;
        }
        else if (this.cursors.right.isDown) {
            this.game.camera.x += this.scrollSpeed;
        }
        if(this.zoomInKey.isDown){
            this.zoomIn();
        }
        else if (this.zoomOutKey.isDown){
            this.zoomOut();
        }
    }

    public render() {
        this.game.debug.cameraInfo(this.game.camera, 500, 32);
        this.game.debug.spriteInfo(this.card, 32, 32);
        this.game.debug.text('Click to toggle sprite / camera movement with cursors', 32, 550);

    }

    private zoomIn() {
        this.zoom += this.zoomIncrement;
        this.camera.scale.setTo(this.zoom);
    }
    private zoomOut() {
        this.zoom -= this.zoomIncrement;
        this.camera.scale.setTo(this.zoom);
    }
}
