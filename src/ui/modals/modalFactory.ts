import DisplayObjectContainer = PIXI.DisplayObjectContainer;
export default class ModalRenderer {


    public static createModal(game: Phaser.Game): Phaser.Group {

        let modalGroup = game.add.group();
        ModalRenderer.fixToCamera(modalGroup);
        ModalRenderer.addOverlay(modalGroup);
        ModalRenderer.addBackground(modalGroup);

        modalGroup.visible = false;
        return modalGroup;

    }

    public static addText(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number = 0, visible = true, callback?: Function): Phaser.Text {
        let game = modalGroup.game;
        let style = {font: '22px Arial', fill: '#000000', align: 'center'};
        let text = modalGroup.game.add.text(modalGroup.game.world.centerX, modalGroup.game.world.centerY, content, style, modalGroup);
        text.x = ((game.width / 2) - (text.width / 2)) + offsetX;
        text.y = ((game.height / 2) - (text.height / 2)) + offsetY;
        text.visible = visible;
        this.addCallback(callback, text);
        this.bringToTop(modalGroup, text);
        return text;

    }

    public static addClickableImage(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number, callback?: Function) {
        let image = modalGroup.game.add.image(0, 0, content);
        let centerX = modalGroup.game.width / 2;
        let centerY = modalGroup.game.height / 2;
        image.x = (centerX - ((image.width) / 2)) + offsetX;
        image.y = (centerY - ((image.height) / 2)) + offsetY;
        let rectangleAroundImage = this.drawRectangleAroundImage(modalGroup, image);
        this.addCallback(() => {
            rectangleAroundImage.visible = !rectangleAroundImage.visible;
        }, image);
        this.addCallback(callback, image);
        this.bringToTop(modalGroup, image);

    }

    private static addOverlay(modalGroup: Phaser.Group) {
        let modal = modalGroup.game.add.graphics(modalGroup.game.width, modalGroup.game.height);
        modal.beginFill(Phaser.Color.getColor(0, 0, 0), 0.7);
        modal.x = 0;
        modal.y = 0;

        modal.drawRect(0, 0, modalGroup.game.width, modalGroup.game.height);
        modalGroup.add(modal);
    }

    private static addBackground(modalGroup: Phaser.Group) {
        let width = 600;
        let height = 300;
        let centerX = modalGroup.game.width / 2;
        let centerY = modalGroup.game.height / 2;
        let background = modalGroup.game.add.graphics(centerX - (width / 2), centerY - ( height / 2));
        background.beginFill(Phaser.Color.getColor(255, 255, 255), 1);
        background.drawRoundedRect(0, 0, width, height, 40);
        background.endFill();
        modalGroup.add(background);
        modalGroup.bringToTop(background);
    }

    private static fixToCamera(group: Phaser.Group) {
        group.fixedToCamera = true;
        group.cameraOffset.x = 0;
        group.cameraOffset.y = 0;
    }

    private static addCallback(callback: Function, image: Phaser.Image) {
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

}
