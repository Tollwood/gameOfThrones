import * as Assets from "../assets";

const MENU = 'menu',
    OVERLAY = 'overlay',
    FADE_DURATION: number = 200,
    MENU_ITEMS = ['Rounds','Wildlings', 'Supply', 'Invluence','Victory'];


export class TopMenu {
    private menu: Array<Phaser.Sprite> = [];
    private overlays: Array<Phaser.Sprite> = [];

     public loadAssets(game: Phaser.Game){
         game.load.image(OVERLAY+'Rounds',Assets.Images.ImagesGamerounds.getPNG());
         game.load.image(MENU + 'Rounds',Assets.Images.ImagesMenuRounds.getPNG());
         game.load.image(OVERLAY+'Wildlings',Assets.Images.ImagesWildlingStatus.getPNG());
         game.load.image(MENU + 'Wildlings',Assets.Images.ImagesMenuWildlings.getPNG());
         game.load.image(OVERLAY+'Supply',Assets.Images.ImagesSupply.getPNG());
         game.load.image(MENU + 'Supply',Assets.Images.ImagesMenuSupply.getPNG());
         game.load.image(OVERLAY+'Invluence',Assets.Images.ImagesInfluence.getPNG());
         game.load.image(MENU + 'Invluence',Assets.Images.ImagesMenuInvluence.getPNG());
         game.load.image(OVERLAY+'Victory',Assets.Images.ImagesVictory.getPNG());
         game.load.image(MENU + 'Victory',Assets.Images.ImagesMenuVictory.getPNG());
    }

    public draw(game: Phaser.Game){
         this.menu.map((menuItem) => {  menuItem.destroy(); });
        this.overlays.map((overlays) => {  overlays.destroy(); });

        let totalWidth : number =  MENU_ITEMS
             .map((menuItem) => {return game.cache.getImage(MENU+ menuItem).width; })
             .reduce((acc, val)=>{return acc + val },0);
         let nextX = (window.innerWidth - totalWidth) / 2;
         this.menu = MENU_ITEMS.map((menuItem) => {
             let item = game.add.sprite( nextX, 0, MENU+menuItem);
             nextX += item.width;
             item.fixedToCamera = true;
             item.inputEnabled = true;
             let overlay = this.createOverlay(game, OVERLAY+menuItem, item.height);
             this.overlays.push(overlay);
             item.events.onInputDown.add(function(){this.fadeInOrOut(overlay)}.bind(this));
            return item;
         });

    }

    public hideOverlayIfNotClicked(): void {
         this.overlays.map((overlay) => { this.tween(overlay,0 );});
    }

    private createOverlay (game: Phaser.Game, imageName: string, menuHeight: number): Phaser.Sprite{
        const cameraCenter = window.innerWidth / 2;
        let overlay = game.add.sprite(0,menuHeight,imageName);
        overlay.x = cameraCenter - game.cache.getImage(imageName).width / 2;
        overlay.fixedToCamera = true;
        overlay.alpha = 0;
        return overlay;
    }

    private fadeInOrOut(sprite: Phaser.Sprite){

         if(sprite.alpha === 0){
             this.tween(sprite,1 );
         }else if (sprite.alpha === 1){
             this.tween(sprite,0 );
         }
    }
    private tween(sprite: Phaser.Sprite, alpha: number){
        sprite.game.add.tween(sprite).to( { alpha: alpha }, FADE_DURATION, "Linear", true);
    }
}