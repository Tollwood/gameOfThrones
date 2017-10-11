import DisplayObjectContainer = PIXI.DisplayObjectContainer;
import Renderer from './renderer';
export default class ModalRenderer {


    public static createModal(game: Phaser.Game, width: number = 600, height: number = 300, color = Phaser.Color.getColor(255, 255, 255)): Phaser.Group {

        let modalGroup = game.add.group();
        ModalRenderer.fixToCamera(modalGroup);
        ModalRenderer.addOverlay(modalGroup);
        ModalRenderer.addBackground(modalGroup, width, height, color);

        modalGroup.visible = false;
        return modalGroup;

    }

    public static addText(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number = 0, visible = true, callback?: Function, fontSize: string = '22px', align: string = 'left'): Phaser.Text {
        let game = modalGroup.game;
        let style = {font: fontSize + ' Gotik', fill: '#000000', align: align};
        let text = modalGroup.game.add.text(modalGroup.game.world.centerX, modalGroup.game.world.centerY, content, style, modalGroup);
        text.x = ((game.width / 2) - (text.width / 2)) + offsetX;
        text.y = ((game.height / 2) - (text.height / 2)) + offsetY;
        text.visible = visible;
        this.addCallback(callback, text);
        this.bringToTop(modalGroup, text);
        return text;

    }

    public static addClickableImage(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number, callback?: Function): Phaser.Image {
        let image = this.addImage(modalGroup, content, offsetY, offsetX);

        let rectangleAroundImage = this.drawRectangleAroundImage(modalGroup, image);
        this.addCallback(() => {
            rectangleAroundImage.visible = !rectangleAroundImage.visible;
        }, image);
        this.addCallback(callback, image);
        return image;
    }

    public static addImage(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number) {
        let image = modalGroup.game.add.image(0, 0, content);
        let centerX = modalGroup.game.width / 2;
        let centerY = modalGroup.game.height / 2;
        image.x = (centerX - ((image.width) / 2)) + offsetX;
        image.y = (centerY - ((image.height) / 2)) + offsetY;
        this.bringToTop(modalGroup, image);
        return image;

    }

    private static addOverlay(modalGroup: Phaser.Group) {
        let modal = modalGroup.game.add.graphics(modalGroup.game.width, modalGroup.game.height);
        modal.beginFill(Phaser.Color.getColor(0, 0, 0), 0.7);
        modal.x = 0;
        modal.y = 0;

        modal.drawRect(0, 0, modalGroup.game.width, modalGroup.game.height);
        modalGroup.add(modal);
    }

    private static addBackground(modalGroup: Phaser.Group, width: number, height: number, color: number) {

        let centerX = modalGroup.game.width / 2;
        let centerY = modalGroup.game.height / 2;
        let background = modalGroup.game.add.graphics(centerX - (width / 2), centerY - ( height / 2));
        background.beginFill(color, 1);
        background.drawRoundedRect(0, 0, width, height, 40);
        background.endFill();
        this.bringToTop(modalGroup, background);
    }

    private static fixToCamera(group: Phaser.Group) {
        group.fixedToCamera = true;
        group.cameraOffset.x = 0;
        group.cameraOffset.y = 0;
    }

    private static addCallback(callback: Function, image: Phaser.Image | Phaser.Graphics) {
        if (callback) {
            image.inputEnabled = true;
            image.events.onInputDown.add(callback, image);
        }
    }

    private static bringToTop(modalGroup: Phaser.Group, displayObjectContainer: DisplayObjectContainer) {
        modalGroup.add(displayObjectContainer);
        modalGroup.bringToTop(displayObjectContainer);
    }

    private static drawRectangleAroundImage(modal: Phaser.Group, image: Phaser.Image): Phaser.Graphics {
        let graphics = modal.game.add.graphics(0, 0);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.drawRect(image.x, image.y, image.width, image.height);
        graphics.visible = false;
        this.bringToTop(modal, graphics);
        return graphics;
    }

    public static closeOnModalClick(modal: Phaser.Group, width: number, height: number, closeFn: () => any) {
        let centerX = modal.game.width / 2;
        let centerY = modal.game.height / 2;
        let closeOnModalClickGraphic = modal.game.add.graphics(centerX - (width / 2), centerY - ( height / 2));
        closeOnModalClickGraphic.beginFill(0, 0);
        closeOnModalClickGraphic.drawRoundedRect(0, 0, width, height, 40);
        closeOnModalClickGraphic.endFill();
        this.addCallback(closeFn, closeOnModalClickGraphic);
        this.bringToTop(modal, closeOnModalClickGraphic);
    }

    public static closeFn = (modal: Phaser.Group) => {
        Renderer.rerenderRequired = true;
        modal.visible = false;
        modal.destroy();
    };

    public static displayModal(modal: Phaser.Group) {
        modal.game.world.bringToTop(modal);
        modal.visible = true;
    }
}
