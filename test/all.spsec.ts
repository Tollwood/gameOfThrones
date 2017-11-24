import {App} from '../src/app';

describe('coverage', () => {
    it('should load whole app to get full coverage of all files', () => {
        let gameConfig: Phaser.IGameConfig = {
            width: 200,
            height: 200,
            renderer: Phaser.AUTO,
            parent: '',
            resolution: 1
        };
        const app = new App(gameConfig);

        expect(app).toBeDefined();
    });
});