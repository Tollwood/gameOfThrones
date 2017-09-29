import {Area, AreaKey} from '../logic/area';
import {House} from '../logic/house';
import {UnitType} from '../logic/units';
export default class ModalRenderer {

    static createModal(game, options): Phaser.Group {
        let type = options.type || ''; // must be unique
        let includeBackground = options.includeBackground; // maybe not optional
        let backgroundColor = options.backgroundColor || '0x000000';
        let backgroundOpacity = options.backgroundOpacity === undefined ?
            0.7 : options.backgroundOpacity;
        let modalCloseOnInput = options.modalCloseOnInput || false;
        let modalBackgroundCallback = options.modalBackgroundCallback || false;
        let vCenter = options.vCenter || true;
        let hCenter = options.hCenter || true;
        let itemsArr = options.itemsArr || [];
        let fixedToCamera = options.fixedToCamera || false;

        let modal;
        let modalGroup = game.add.group();
        if (fixedToCamera === true) {
            modalGroup.fixedToCamera = true;
            modalGroup.cameraOffset.x = 0;
            modalGroup.cameraOffset.y = 0;
        }

        if (includeBackground === true) {
            modal = game.add.graphics(game.width, game.height);
            modal.beginFill(backgroundColor, backgroundOpacity);
            modal.x = 0;
            modal.y = 0;

            modal.drawRect(0, 0, game.width, game.height);

            if (modalCloseOnInput === true) {

                let innerModal = game.add.sprite(0, 0);
                innerModal.inputEnabled = true;
                innerModal.width = game.width;
                innerModal.height = game.height;
                innerModal.type = type;
                innerModal.input.priorityID = 0;
                innerModal.events.onInputDown.add(function (e, pointer) {
                    this.hideModal(e.type);
                }, this, 2);

                modalGroup.add(innerModal);
            } else {

                modalBackgroundCallback = true;
            }
        }

        if (modalBackgroundCallback) {
            let _innerModal = game.add.sprite(0, 0);
            _innerModal.inputEnabled = true;
            _innerModal.width = game.width;
            _innerModal.height = game.height;
            _innerModal.type = type;
            _innerModal.input.priorityID = 0;

            modalGroup.add(_innerModal);
        }

        if (includeBackground) {
            modalGroup.add(modal);
        }

        let modalLabel;
        for (let i = 0; i < itemsArr.length; i += 1) {
            let item = itemsArr[i];
            let itemType = item.type || 'text';
            let itemColor = item.color || 0x000000;
            let itemFontfamily = item.fontFamily || 'Arial';
            let itemFontSize = item.fontSize || 32;
            let itemStroke = item.stroke || '0x000000';
            let itemStrokeThickness = item.strokeThickness || 0;
            let itemAlign = item.align || 'center';
            let offsetX = item.offsetX || 0;
            let offsetY = item.offsetY || 0;
            let contentScale = item.contentScale || 1;
            let content = item.content || '';
            let centerX = game.width / 2;
            let centerY = game.height / 2;
            let callback = item.callback || false;
            let textAlign = item.textAlign || 'left';
            let atlasParent = item.atlasParent || '';
            let buttonHover = item.buttonHover || content;
            let buttonActive = item.buttonActive || content;
            let graphicColor = item.graphicColor || 0xffffff;
            let graphicOpacity = item.graphicOpacity || 1;
            let graphicW = item.graphicWidth || 200;
            let graphicH = item.graphicHeight || 200;
            let graphicRadius = item.graphicRadius || 0;
            let lockPosition = item.lockPosition || false;

            let itemAnchor = item.anchor || {x: 0, y: 0};
            let itemAngle = item.angle || 0;
            let itemX = item.x || 0;
            let itemY = item.y || 0;
            let imageFrame = item.frame || null;
            let tileSpriteWidth = item.tileSpriteWidth || game.width;
            let tileSpriteHeight = item.tileSpriteHeight || game.height;

            modalLabel = null;

            if (itemType === 'text' || itemType === 'bitmapText') {

                if (itemType === 'text') {

                    let re = new RegExp('/[\{\}]/', 'g');
                    let arrOfBold = [];
                    let newLineOffset = 0;
                    if (content.match(re) !== null) {
                        for (let k = 0; k < content.length; k++) {
                            let boldStartPos = content[k].indexOf('{');
                            let boldEndPos = content[k].indexOf('}');
                            let lengthOfString = content[k].match(/(\r\n|\n|\r)/);
                            if (lengthOfString !== null) {
                                newLineOffset += 1;
                            }
                            if (boldStartPos !== -1 || boldEndPos !== -1) {
                                arrOfBold.push(k - newLineOffset);
                            }
                        }

                        content = content.replace(re, '');
                    }

                    modalLabel = game.add.text(0, 0, content, {
                        font: itemFontSize + 'px ' + itemFontfamily,
                        fill: '#' + String(itemColor).replace('0x', ''),
                        stroke: '#' + String(itemStroke).replace('0x', ''),
                        strokeThickness: itemStrokeThickness,
                        align: itemAlign
                    });
                    modalLabel.contentType = 'text';
                    modalLabel.update();
                    let indexMissing = 0;
                    for (let j = 0; j < arrOfBold.length; j += 2) {
                        modalLabel.addFontWeight('bold', arrOfBold[j] - indexMissing);
                        modalLabel.addFontWeight('normal', arrOfBold[j + 1] - indexMissing);
                        indexMissing += 2;
                    }
                    modalLabel.x = ((game.width / 2) - (modalLabel.width / 2)) + offsetX;
                    modalLabel.y = ((game.height / 2) - (modalLabel.height / 2)) + offsetY;
                } else {
                    modalLabel = game.add.bitmapText(0, 0, itemFontfamily, String(content), itemFontSize);
                    modalLabel.contentType = 'bitmapText';
                    modalLabel.align = textAlign;
                    modalLabel.updateText();
                    modalLabel.x = (centerX - (modalLabel.width / 2)) + offsetX;
                    modalLabel.y = (centerY - (modalLabel.height / 2)) + offsetY;
                }

            } else if (itemType === 'image') {
                modalLabel = game.add.image(0, 0, content);
                modalLabel.scale.setTo(contentScale, contentScale);
                modalLabel.contentType = 'image';
                modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
            } else if (itemType === 'tileSprite') {
                modalLabel = game.add.tileSprite(itemX, itemY,
                    tileSpriteWidth, tileSpriteHeight, content, imageFrame);
                modalLabel.scale.setTo(contentScale, contentScale);
                modalLabel.anchor.setTo(itemAnchor.x, itemAnchor.y);
                modalLabel.angle = itemAngle;
                modalLabel.contentType = 'tileSprite';
            } else if (itemType === 'sprite') {
                modalLabel = game.add.sprite(0, 0, atlasParent, content);
                modalLabel.scale.setTo(contentScale, contentScale);
                modalLabel.contentType = 'sprite';
                modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
            } else if (itemType === 'button') {
                modalLabel = game.add.button(0, 0, atlasParent, callback,
                    this, buttonHover, content, buttonActive, content);
                modalLabel.scale.setTo(contentScale, contentScale);
                modalLabel.contentType = 'button';
                modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;

            } else if (itemType === 'graphics') {
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


    static showEstablishControlModal(game, area: Area, yesFn) {
        let modal = this.createModal(game, {
            type: 'establishControl',
            includeBackground: true,
            itemsArr: [
                {
                    type: 'graphics',
                    graphicColor: '0xffffff',
                    graphicWidth: 500,
                    graphicHeight: 300,
                    graphicRadius: 40
                },
                {
                    type: 'text',
                    content: 'Establish Control over ' + area.key,
                    fontFamily: 'Luckiest Guy',
                    fontSize: 22,
                    color: '0x1e1e1e',
                    offsetY: -50
                },
                {
                    type: 'text',
                    content: 'Yes',
                    fontFamily: 'Luckiest Guy',
                    fontSize: 22,
                    color: '0x1e1e1e',
                    offsetY: 50,
                    offsetX: -100,
                    callback: function () {
                        yesFn();
                        modal.visible = false;
                        modal.destroy();
                    }.bind(this),
                },
                {
                    type: 'text',
                    content: 'No',
                    fontFamily: 'Luckiest Guy',
                    fontSize: 22,
                    color: '0x1e1e1e',
                    offsetY: 50,
                    offsetX: 100,
                    callback: function () {
                        modal.visible = false;
                        modal.destroy();
                    }.bind(this),
                },
            ]
        });
        game.world.bringToTop(modal);
        modal.visible = true;
    }

    static showSplitArmyModal(game: Phaser.Game, sourceArea: Area, targetAreaKey: AreaKey,) {

        let items = new Array<any>();
        items.push({
            type: 'graphics',
            graphicColor: '0xffffff',
            graphicWidth: 500,
            graphicHeight: 300,
            graphicRadius: 40
        });
        items.push({
            type: 'text',
            content: 'Select units to move from ' + sourceArea.key + ' to ' + targetAreaKey,
            fontFamily: 'Luckiest Guy',
            fontSize: 22,
            color: '0x1e1e1e',
            offsetY: -100
        });
        items.push({
            type: 'text',
            content: 'More orders for ' + sourceArea.key,
            fontFamily: 'Luckiest Guy',
            fontSize: 22,
            offsetY: 50,
            color: '0x1e1e1e',
        });
        items.push({
            type: 'text',
            content: 'Yes',
            fontFamily: 'Luckiest Guy',
            fontSize: 22,
            color: '0x1e1e1e',
            offsetY: 100,
            offsetX: -100,
            callback: function () {

                modal.visible = false;
                modal.destroy();
            }.bind(this),
        });
        items.push({
            type: 'text',
            content: 'No',
            fontFamily: 'Luckiest Guy',
            fontSize: 22,
            color: '0x1e1e1e',
            offsetY: 100,
            offsetX: 100,
            callback: function () {
                modal.visible = false;
                modal.destroy();
            }.bind(this),
        });

        let offsetXIncrement = 60;
        let offsetX = -1 * offsetXIncrement * sourceArea.units.length / 2;
        sourceArea.units.forEach((unit) => {
            let conent = House[unit.getHouse()] + UnitType[unit.getType()];
            let item = {
                type: "image",
                content: conent,
                offsetX: offsetX,
            };
            items.push(item);
            offsetX += offsetXIncrement;
        });

        let modal = this.createModal(game, {
            type: 'establishControl',
            includeBackground: true,
            itemsArr: items,
        });
        game.world.bringToTop(modal);
        modal.visible = true;

    }
}
