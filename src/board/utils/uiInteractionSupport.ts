import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import UiArea from './UiArea';

export default class UiInteractionSupport {

    public static addInputDownCallback(callback: Function, image: Phaser.Image | Phaser.Graphics | Phaser.Text) {
        if (callback) {
            image.inputEnabled = true;
            image.events.onInputDown.add(callback, image);
        }
    }

    public static intersects(camera: Phaser.Camera, sprite: Phaser.Sprite, area: UiArea): boolean {
        const scale: Phaser.Point = camera.scale;
        let boundsA = new Phaser.Rectangle(sprite.worldPosition.x * scale.x, sprite.worldPosition.y * scale.y, sprite.width * scale.x, sprite.height * scale.y);
        let relativeX = area.x - camera.x;
        let relativeY = area.y - camera.y;
        let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }


    public static createDragAndDrop(sprite: Phaser.Sprite, stopDragAndDropFn) {
        sprite.inputEnabled = true;
        sprite.input.enableDrag();
        this.fixDragWhileZooming(sprite);
        sprite.events.onDragStop.add(stopDragAndDropFn);
    }

    private static fixDragWhileZooming(sprite) {

        sprite.events.onDragUpdate.add(function (sprite, pointer) {
            const pos = sprite.game.input.getLocalPosition(sprite.parent, pointer);
            if (sprite.hitArea) {
                sprite.x = pos.x - sprite.hitArea.width / 2;
                sprite.y = pos.y - sprite.hitArea.height / 2;
            } else {
                sprite.x = pos.x - sprite.width / 2;
                sprite.y = pos.y - sprite.height / 2;
            }
        }, sprite);
        return sprite;
    }
}
