import 'phaser';
import {BaseScene} from './BaseScene';

export class LevelMenuScene extends BaseScene {

    constructor() {
        super('LevelMenuScene');
    }

    init(data): void {

    }

    preload(): void {
        this.load.image('background', 'assets/ui/background1.png');
        this.load.image('catButton', 'assets/ui/cat_button.png');
        this.load.image('levelOneButton', 'assets/ui/level1_button.png');
        this.load.image('levelTwoButton', 'assets/ui/level2_button.png');
        this.load.image('levelThreeButton', 'assets/ui/level3_button.png');

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transitionIn();

        let background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let catButton = this.add.sprite(this.cameras.main.width / 10 * 5, this.cameras.main.height / 10 * 3, 'catButton');
        let levelOneButton = this.add.sprite(this.cameras.main.width / 10 * 2, this.cameras.main.height / 10 * 7, 'levelOneButton');
        let levelTwoButton = this.add.sprite(this.cameras.main.width / 10 * 5, this.cameras.main.height / 10 * 7, 'levelTwoButton');
        let levelThreeButton = this.add.sprite(this.cameras.main.width / 10 * 8, this.cameras.main.height / 10 * 7, 'levelThreeButton');

        catButton.setOrigin(0.5, 0.5);
        levelOneButton.setOrigin(0.5, 0.5);
        levelTwoButton.setOrigin(0.5, 0.5);
        levelThreeButton.setOrigin(0.5, 0.5);

        catButton.setDisplaySize(this.cameras.main.height / 3, this.cameras.main.height / 3);
        levelOneButton.setDisplaySize(this.cameras.main.height / 3, this.cameras.main.height / 3);
        levelTwoButton.setDisplaySize(this.cameras.main.height / 3, this.cameras.main.height / 3);
        levelThreeButton.setDisplaySize(this.cameras.main.height / 3, this.cameras.main.height / 3);

        catButton.setInteractive();
        levelOneButton.setInteractive();
        levelTwoButton.setInteractive();
        levelThreeButton.setInteractive();

        catButton.on('pointerdown', function(event) {
            catButton.setTint(0xcccccc);
        }, this);
        catButton.on('pointerup', function(event) {
            catButton.clearTint();
            this.game.scene.start('SortingSceneLoader');
            this.game.scene.stop(this.key);
            return;
        }, this);

        levelOneButton.on('pointerdown', function(event) {
            levelOneButton.setTint(0xcccccc);
        }, this);
        levelOneButton.on('pointerup', function(event) {
            levelOneButton.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': false});
            return;
        }, this);

        levelTwoButton.on('pointerdown', function(event) {
            levelTwoButton.setTint(0xcccccc);
        }, this);
        levelTwoButton.on('pointerup', function(event) {
            levelTwoButton.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': true});
            return;
        }, this);

        levelThreeButton.on('pointerdown', function(event) {
            levelThreeButton.setTint(0xcccccc);
        }, this);
        levelThreeButton.on('pointerup', function(event) {
            levelThreeButton.clearTint();
            this.transitionOut('GameSceneLoader', {'setLevel': 3});
            return;
        }, this);
    }

    update(time: number): void {

    }
}
