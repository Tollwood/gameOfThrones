import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import Renderer from './renderer';
import UiInteractionSupport from './uiInteractionSupport';

export default class Modal {
  group = Phaser.Group;
  _width: number;
  _height: number;
  private _color: number;
  private _renderer: Renderer;

  constructor(renderer: Renderer, width: number = 600, height: number = 300, color = Phaser.Color.getColor(255, 255, 255)) {
    this.group = renderer.game.add.group();
    this._renderer = renderer;
    this._width = width;
    this._height = height;
    this._color = color;
    this.fixToCamera();
    this.addOverlay();
    this.addBackground(width, height, color);
    this.group.visible = false;
  }

  public show() {
    this._renderer.game.world.bringToTop(this);
    this.group.visible = true;
  }

  public close() {
    this.group.visible = false;
    this._renderer.removeSelectedToken();
    this.group.destroy();
  };

  private addOverlay() {
    let overlay = this._renderer.game.add.graphics(this._renderer.game.width, this._renderer.game.height);
    overlay.beginFill(Phaser.Color.getColor(0, 0, 0), 0.7);
    overlay.x = 0;
    overlay.y = 0;

    overlay.drawRect(0, 0, this._renderer.game.width, this._renderer.game.height);
    this.group.add(overlay);
  }

  private addBackground(width: number, height: number, color: number) {

    let centerX = this._renderer.game.width / 2;
    let centerY = this._renderer.game.height / 2;
    let background = this._renderer.game.add.graphics(centerX - (width / 2), centerY - (height / 2));
    background.beginFill(color, 1);
    background.drawRoundedRect(0, 0, width, height, 40);
    background.endFill();
    this.addToTop(background);
  }

  private fixToCamera() {
    this.group.fixedToCamera = true;
    this.group.cameraOffset.x = 0;
    this.group.cameraOffset.y = 0;
  }

  // -------


  addText(content: string, offsetY: number, offsetX: number = 0, visible = true, callback?: Function, fontSize: string = '22px', align: string = 'left'): Phaser.Text {
    let game = this._renderer.game;
    let style = {font: fontSize + ' Gotik', fill: '#000000', align: align};
    let text = game.add.text(game.world.centerX, game.world.centerY, content, style, this.group);
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
    let image = this._renderer.game.add.image(0, 0, content);
    let centerX = this._renderer.game.width / 2;
    let centerY = this._renderer.game.height / 2;
    image.x = (centerX - ((image.width) / 2)) + offsetX;
    image.y = (centerY - ((image.height) / 2)) + offsetY;
    this.addToTop(image);
    return image;

  }

  private addToTop(displayObjectContainer: any) {
    this.group.add(displayObjectContainer);
    this.group.bringToTop(displayObjectContainer);
  }

  public drawRectangleAroundObject(object: any): Phaser.Graphics {
    let graphics = this._renderer.game.add.graphics(0, 0);
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(object.x, object.y, object.width, object.height);
    graphics.visible = false;
    this.addToTop(graphics);
    return graphics;
  }

  public closeOnModalClick(closeFn: () => any) {
    let centerX = this._renderer.game.width / 2;
    let centerY = this._renderer.game.height / 2;
    let closeOnModalClickGraphic = this._renderer.game.add.graphics(centerX - (this.group.width / 2), centerY - (this.group.height / 2));
    closeOnModalClickGraphic.beginFill(0, 0);
    closeOnModalClickGraphic.drawRoundedRect(0, 0, this.group.width, this.group.height, 40);
    closeOnModalClickGraphic.endFill();
    UiInteractionSupport.addInputDownCallback(closeFn, closeOnModalClickGraphic);
    this.addToTop(closeOnModalClickGraphic);
  }
}
