import DisplayObjectContainer = PIXI.DisplayObjectContainer;
export default class ModalRenderer {


    public static createModal(game: Phaser.Game, itemsArr: Array<any>): Phaser.Group {
        itemsArr.unshift({
            type: 'graphics',
            graphicColor: '0xffffff',
            graphicWidth: 500,
            graphicHeight: 300,
            graphicRadius: 40
        });
        let modalGroup = game.add.group();
        ModalRenderer.fixToCamera(modalGroup);
        ModalRenderer.includeBackGround(modalGroup);

        let modalLabel;
        for (let i = 0; i < itemsArr.length; i += 1) {
            let item = itemsArr[i];
            let itemType = item.type || 'text';
            let imageFrame = item.frame || null;

            let offsetX = item.offsetX || 0;
            let offsetY = item.offsetY || 0;
            let contentScale = item.contentScale || 1;
            let content = item.content || '';
            let centerX = game.width / 2;
            let centerY = game.height / 2;
            let callback = item.callback || false;

            let graphicColor = item.graphicColor || 0xffffff;
            let graphicOpacity = item.graphicOpacity || 1;
            let graphicW = item.graphicWidth || 200;
            let graphicH = item.graphicHeight || 200;
            let graphicRadius = item.graphicRadius || 0;
            let lockPosition = item.lockPosition || false;

            modalLabel = null;

            if (itemType === 'image') {
                modalLabel = game.add.image(0, 0, content);
                modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
                modalLabel.scale.setTo(contentScale, contentScale);
                modalLabel.contentType = 'image';
            }
            else if (itemType === 'graphics') {
                modalLabel = game.add.graphics(graphicW, graphicH);
                modalLabel.beginFill(graphicColor, graphicOpacity);
                if (graphicRadius <= 0) {
                    modalLabel.drawRect(0, 0, graphicW, graphicH);
                } else {
                    modalLabel.drawRoundedRect(0, 0, graphicW, graphicH, graphicRadius);
                }
                modalLabel.endFill();
                modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
            }

            modalLabel['_offsetX'] = 0;
            modalLabel['_offsetY'] = 0;
            modalLabel.lockPosition = lockPosition;
            modalLabel._offsetX = offsetX;
            modalLabel._offsetY = offsetY;

            if (callback !== false && itemType !== 'button') {
                modalLabel.inputEnabled = true;
                modalLabel.pixelPerfectClick = true;
                modalLabel.priorityID = 10;
                modalLabel.events.onInputDown.add(callback, modalLabel);
            }

            if (itemType !== 'bitmapText' && itemType !== 'graphics') {
                modalLabel.bringToTop();
                modalGroup.add(modalLabel);
                modalLabel.bringToTop();
                modalGroup.bringToTop(modalLabel);
            } else {
                modalGroup.add(modalLabel);
                modalGroup.bringToTop(modalLabel);
            }
        }

        modalGroup.visible = false;
        modalGroup.fixedToCamera = true;
        return modalGroup;

    }

    public static addText(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number = 0, callback?: Function) {
        let game = modalGroup.game;
        var style = {font: "22px Arial", fill: "#000000", align: "center"};
        var text = modalGroup.game.add.text(modalGroup.game.world.centerX, modalGroup.game.world.centerY, content, style, modalGroup);
        text.x = ((game.width / 2) - (text.width / 2)) + offsetX;
        text.y = ((game.height / 2) - (text.height / 2)) + offsetY;
        this.addCallback(callback, text);
        this.bringToTop(modalGroup, text);

    }

    private static includeBackGround(modalGroup: Phaser.Group) {
        let modal = modalGroup.game.add.graphics(modalGroup.game.width, modalGroup.game.height);
        modal.beginFill(Phaser.Color.getColor(0, 0, 0), 0.7);
        modal.x = 0;
        modal.y = 0;

        modal.drawRect(0, 0, modalGroup.game.width, modalGroup.game.height);
        modalGroup.add(modal);
    }

    public static addImage(modalGroup: Phaser.Group, content: string, offsetY: number, offsetX: number, callback?: Function) {
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

    public static addCallback(callback: Function, image: Phaser.Image) {
        if (callback) {
            image.inputEnabled = true;
            image.events.onInputDown.add(callback, image);
        }
    }

    private static fixToCamera(group: Phaser.Group) {
        group.fixedToCamera = true;
        group.cameraOffset.x = 0;
        group.cameraOffset.y = 0;
    }

    private static bringToTop(modalGroup: Phaser.Group, displayObjectContainer: DisplayObjectContainer) {
        modalGroup.add(displayObjectContainer);
        modalGroup.bringToTop(displayObjectContainer);
    }

    private static drawRectangleAroundImage(modal: Phaser.Group, image: Phaser.Image): Phaser.Graphics {
        var graphics = modal.game.add.graphics(0, 0);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.drawRect(image.x, image.y, image.width, image.height);
        graphics.visible = false;
        this.bringToTop(modal, graphics);
        return graphics;
    }
}
