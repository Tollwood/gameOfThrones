export default class DragAndDropSupport {

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