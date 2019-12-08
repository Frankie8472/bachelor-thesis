import 'phaser';
import {BaseScene} from './BaseScene';

export class LevelMenuScene extends BaseScene {
    /**
     * Group with all level buttons
     */
    private levelButtons: Phaser.GameObjects.Group;

    /**
     * Global size of all buttons
     */
    private buttonSize: number;

    constructor() {
        super('LevelMenuScene');
    }

    init(): void {
        // Initialize fields
        this.levelButtons = this.add.group();

        // Define button size dependant on the screen dimensions and the number of buttons
        this.buttonSize = Math.min(this.cameras.main.width / (4 + 2), this.cameras.main.height / (3 + 2));
    }

    preload(): void {
        // Load UI
        this.load.image('background', 'assets/ui/background1.png');
        this.load.image('catButton', 'assets/ui/cat_button.png');
        this.load.image('levelButton11', 'assets/ui/level11_button.png');
        this.load.image('levelButton12', 'assets/ui/level12_button.png');
        this.load.image('levelButton13', 'assets/ui/level13_button.png');
        this.load.image('levelButton14', 'assets/ui/level14_button.png');
        this.load.image('levelButton21', 'assets/ui/level21_button.png');
        this.load.image('levelButton22', 'assets/ui/level22_button.png');
        this.load.image('levelButton23', 'assets/ui/level23_button.png');
        this.load.image('levelButton24', 'assets/ui/level24_button.png');
        this.load.image('levelButton31', 'assets/ui/level31_button.png');
        this.load.image('levelButton32', 'assets/ui/level32_button.png');
        this.load.image('levelButton33', 'assets/ui/level33_button.png');
        this.load.image('levelButton34', 'assets/ui/level34_button.png');

    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.key);
        this.transitionIn();

        this.setBackground();
        this.setLevelButtons();
    }

    update(time: number): void {

    }

    /**
     * Function for initializing background graphics
     */
    private setBackground() {
        const background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    }

    /**
     * Function for initializing the level buttons and their onclick action
     */
    private setLevelButtons() {
        const catButton: Phaser.GameObjects.Sprite = this.add.sprite(20, this.cameras.main.height - 20, 'catButton');
        const levelButton11: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 1, 'levelButton11');
        const levelButton12: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 1, 'levelButton12');
        const levelButton13: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 1, 'levelButton13');
        const levelButton14: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 1, 'levelButton14');
        const levelButton21: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 2, 'levelButton21');
        const levelButton22: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 2, 'levelButton22');
        const levelButton23: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 2, 'levelButton23');
        const levelButton24: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 2, 'levelButton24');
        const levelButton31: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 3, 'levelButton31');
        const levelButton32: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 3, 'levelButton32');
        const levelButton33: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 3, 'levelButton33');
        const levelButton34: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 3, 'levelButton34');

        this.levelButtons.addMultiple([
            levelButton11,
            levelButton12,
            levelButton13,
            levelButton14,
            levelButton21,
            levelButton22,
            levelButton23,
            levelButton24,
            levelButton31,
            levelButton32,
            levelButton33,
            levelButton34
        ]);

        catButton.setOrigin(0, 1);

        const scaleCatButton: number = this.imageScalingFactor(this.buttonSize / 1.5, catButton.width, catButton.height);
        catButton.setScale(scaleCatButton, scaleCatButton);
        catButton.setInteractive();

        catButton.on('pointerdown', function() {
            catButton.setTint(0xcccccc);
        }, this);

        catButton.on('pointerup', function() {
            catButton.clearTint();
            this.transitionOut('SortingSceneLoader');
        }, this);

        this.levelButtons.getChildren().forEach(function(gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setName(gameObject.texture.key);
                gameObject.setOrigin(0.5, 0.5);

                const scale: number = this.imageScalingFactor(this.buttonSize, gameObject.width, gameObject.height);
                gameObject.setScale(scale, scale);

                gameObject.setInteractive();
                gameObject.on('pointerdown', function() {
                    gameObject.setTint(0xcccccc);
                }, this);
            }
        }, this);

        levelButton11.on('pointerup', function() {
            levelButton11.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': false});
        }, this);

        levelButton12.on('pointerup', function() {
            levelButton12.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': false});
            return;
        }, this);

        levelButton13.on('pointerup', function() {
            levelButton13.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': false});
        }, this);

        levelButton14.on('pointerup', function() {
            levelButton14.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': false});
        }, this);

        levelButton21.on('pointerup', function() {
            levelButton21.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': true});
        }, this);

        levelButton22.on('pointerup', function() {
            levelButton22.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': true});
        }, this);

        levelButton23.on('pointerup', function() {
            levelButton23.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': true});
        }, this);

        levelButton24.on('pointerup', function() {
            levelButton24.clearTint();
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': true});
        }, this);

        levelButton31.on('pointerup', function() {
            levelButton31.clearTint();
            this.transitionOut('RestrictedSortingSceneLoader', {'level': 1});
        }, this);

        levelButton32.on('pointerup', function() {
            levelButton32.clearTint();
            this.transitionOut('RestrictedSortingSceneLoader', {'level': 2});
        }, this);

        levelButton33.on('pointerup', function() {
            levelButton33.clearTint();
            this.transitionOut('GameSceneLoader', {'level': 1});
        }, this);

        levelButton34.on('pointerup', function() {
            levelButton34.clearTint();
            this.transitionOut('GameSceneLoader', {'level': 2});
        }, this);
    }
}
