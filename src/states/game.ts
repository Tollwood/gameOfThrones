import * as Assets from '../assets';
import game = PIXI.game;

export default class Game extends Phaser.State {
    
    private ORDER_TOKEN_WIDTH: number = 90;
    private ORDER_TOKEN_HEIGHT: number = 90;

    private SCROLL_SPEED: number = 8;

    private zoom: number = 1;
    private zoomIncrement: number = 0.01;

    public preload() {
        this.game.load.image('gameboard', Assets.Images.ImagesMap.getPNG());
        this.game.load.image('card', Assets.Images.ImagesHouseStark.getPNG());
        this.game.load.spritesheet("orderTokens",Assets.Images.ImagesOrdertokens.getPNG(),this.ORDER_TOKEN_WIDTH,this.ORDER_TOKEN_HEIGHT,11);
    }

    public create(): void {
        this.createBoard(this.game);
        this.creatOrderTokens(this.game);
        this.game.input.enabled = true;
    }

    private creatOrderTokens(game :Phaser.Game) {
        const
            ORDER_TOKEN_SPACING: number = 10,
            START_HEIGHT :number = 5,
            START_WIDTH : number = 0;

        game.add.sprite(START_WIDTH,START_HEIGHT ,"orderTokens",0);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 1, START_HEIGHT,"orderTokens",1);
        game.add.sprite(START_WIDTH + (ORDER_TOKEN_SPACING + this.ORDER_TOKEN_WIDTH)* 2, START_HEIGHT,"orderTokens",2);

        game.add.sprite(START_WIDTH,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 1),"orderTokens",3);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 1, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 1),"orderTokens",3);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 2,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 1),"orderTokens",4);

        game.add.sprite(START_WIDTH,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 2),"orderTokens",5);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 1, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 2),"orderTokens",5);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 2,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 2),"orderTokens",6);

        game.add.sprite(START_WIDTH,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",7);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 1, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",7);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 2,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",8);

        game.add.sprite(START_WIDTH,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",9);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 1, START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",9);
        game.add.sprite(START_WIDTH+ (ORDER_TOKEN_SPACING +  this.ORDER_TOKEN_WIDTH) * 2,START_HEIGHT + (this.ORDER_TOKEN_WIDTH * 3),"orderTokens",10);

    }

    public update() {
        this.handleNavigationOnMap(this.game);
        this.handleZoom(this.game);

    }

    private handleNavigationOnMap(game: Phaser.Game) {
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

    public render() {
    }

    private zoomIn() {
        this.zoom += this.zoomIncrement;
        this.camera.scale.setTo(this.zoom);
    }
    private zoomOut() {
        this.zoom -= this.zoomIncrement;
        this.camera.scale.setTo(this.zoom);
    }

    private createBoard(game: Phaser.Game) {
        const gameboard = game.add.sprite(0, 0, 'gameboard');
        game.world.setBounds(gameboard.x, gameboard.y, gameboard.width, gameboard.height );

    }

    private handleZoom(game: Phaser.Game) {
        if (game.input.keyboard.isDown(Phaser.KeyCode.Q)) {
            this.zoomIn();
        }
        else if (game.input.keyboard.isDown(Phaser.KeyCode.Y)) {
            this.zoomOut();
        }
    }
}
