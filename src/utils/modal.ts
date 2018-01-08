import DisplayObjectContainer = PIXI.DisplayObjectContainer;
import Renderer from './renderer';
import UiInteractionSupport from './uiInteractionSupport';
export default class Modal extends Phaser.Group {
    _width: number;
    _height: number;
    private _color: number;
    private _renderer: Renderer;

    constructor(renderer: Renderer, width: number = 600, height: number = 300, color = Phaser.Color.getColor(255, 255, 255)) {
        super(renderer.game);
        this._renderer = renderer;
        this._width = width;
        this._height = height;
        this._color = color;
        this.fixToCamera();
        this.addOverlay();
        this.addBackground(width, height, color);
        this.visible = false;
    }

    public show() {
        this.game.world.bringToTop(this);
        this.visible = true;
    }

    public close() {
        this.visible = false;
        this._renderer.removeSelectedToken();
        this.destroy();
    };

    private addOverlay() {
        let overlay = this.game.add.graphics(this.game.width, this.game.height);
        overlay.beginFill(Phaser.Color.getColor(0, 0, 0), 0.7);
        overlay.x = 0;
        overlay.y = 0;

        overlay.drawRect(0, 0, this.game.width, this.game.height);
        this.add(overlay);
    }

    private addBackground(width: number, height: number, color: number) {

        let centerX = this.game.width / 2;
        let centerY = this.game.height / 2;
        let background = this.game.add.graphics(centerX - (width / 2), centerY - ( height / 2));
        background.beginFill(color, 1);
        background.drawRoundedRect(0, 0, width, height, 40);
        background.endFill();
        this.addToTop(background);
    }

    private fixToCamera() {
        this.fixedToCamera = true;
        this.cameraOffset.x = 0;
        this.cameraOffset.y = 0;
    }

    // -------


    addText(content: string, offsetY: number, offsetX: number = 0, visible = true, callback?: Function, fontSize: string = '22px', align: string = 'left'): Phaser.Text {
        let game = this.game;
        let style = {font: fontSize + ' Gotik', fill: '#000000', align: align};
        let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, content, style, this);
        text.x = ((game.width / 2) - (text.width / 2)) + offsetX;
        text.y = ((game.height / 2) - (text.height / 2)) + offsetY;
        text.visible = visible;
        UiInteractionSupport.addInputDownCallback(callback, text);
        this.addToTop(text);
        return text;

    }

    addToggleText(content: string, offsetY: number, offsetX: number = 0, visible = true, callback?: Function, fontSize: string = '22px', align: string = 'left'): Phaser.Text {

        let text = this.addText(content, offsetY, offsetX, visible, callback, fontSize, align);
        let rectangleAroundImage = this.drawRectangleAroundObject(text);
        UiInteractionSupport.addInputDownCallback(() => {
            rectangleAroundImage.visible = !rectangleAroundImage.visible;
        }, text);
        UiInteractionSupport.addInputDownCallback(callback, text);
        return text;

    }

    addClickableImage(content: string, offsetY: number, offsetX: number, callback?: Function): Phaser.Image {
        let image = this.addImage(content, offsetY, offsetX);

        let rectangleAroundImage = this.drawRectangleAroundObject(image);
        UiInteractionSupport.addInputDownCallback(() => {
            rectangleAroundImage.visible = !rectangleAroundImage.visible;
        }, image);
        UiInteractionSupport.addInputDownCallback(callback, image);
        return image;
    }

    addImage(content: string, offsetY: number, offsetX: number) {
        let image = this.game.add.image(0, 0, content);
        let centerX = this.game.width / 2;
        let centerY = this.game.height / 2;
        image.x = (centerX - ((image.width) / 2)) + offsetX;
        image.y = (centerY - ((image.height) / 2)) + offsetY;
        this.addToTop(image);
        return image;

    }

    private addToTop(displayObjectContainer: DisplayObjectContainer) {
        this.add(displayObjectContainer);
        this.bringToTop(displayObjectContainer);
    }

    public drawRectangleAroundObject(object: DisplayObjectContainer): Phaser.Graphics {
        let graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.drawRect(object.x, object.y, object.width, object.height);
        graphics.visible = false;
        this.addToTop(graphics);
        return graphics;
    }

    public closeOnModalClick(closeFn: () => any) {
        let centerX = this.game.width / 2;
        let centerY = this.game.height / 2;
        let closeOnModalClickGraphic = this.game.add.graphics(centerX - (this.width / 2), centerY - ( this.height / 2));
        closeOnModalClickGraphic.beginFill(0, 0);
        closeOnModalClickGraphic.drawRoundedRect(0, 0, this.width, this.height, 40);
        closeOnModalClickGraphic.endFill();
        UiInteractionSupport.addInputDownCallback(closeFn, closeOnModalClickGraphic);
        this.addToTop(closeOnModalClickGraphic);
    }
}
