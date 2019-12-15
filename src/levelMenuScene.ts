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
        this.game.scene.sendToBack(this.getKey());
        this.transitionIn();

        this.setBackground();
        this.setLevelButtons();
        this.initInput();
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
        catButton.setName('catButton');
        catButton.setInteractive();

        this.levelButtons.getChildren().forEach(function(gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setName(gameObject.texture.key);
                gameObject.setOrigin(0.5, 0.5);

                const scale: number = this.imageScalingFactor(this.buttonSize, gameObject.width, gameObject.height);
                gameObject.setScale(scale, scale);

                gameObject.setData('clicked', false);

                gameObject.setInteractive();
            }
        }, this);

        this.levelButtons.add(catButton);
    }

    /**
     * Function for initializing all input
     */
    private initInput(): void {
        this.input.on('pointerdown', function(pointer, currentlyOver) {
            const gameObject: any = currentlyOver[0];
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setTint(0xcccccc);
                gameObject.setData('clicked', true);
            }
        }, this);

        this.input.on('pointerup', function(pointer, currentlyOver) {
            const gameObject: any = currentlyOver[0];

            if (gameObject instanceof Phaser.GameObjects.Sprite && gameObject.getData('clicked')) {
                this.buttonFunction(gameObject);
            }

            this.levelButtons.getChildren().forEach(function(gameObject) {
                if (gameObject instanceof Phaser.GameObjects.Sprite) {
                    gameObject.clearTint();
                    gameObject.setData('clicked', false);
                }
            }, this);
        }, this);
    }

    /**
     * Function for assigning each button an event function
     * @param gameObject GameObject on which you want the function on
     */
    private buttonFunction(gameObject: Phaser.GameObjects.Sprite): void {
        switch (gameObject.name) {
            case 'catButton': {
                this.transitionOut('SortingSceneLoader');
                break;
            }
            case 'levelButton11': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': false});
                break;
            }

            case 'levelButton12': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': false});

                break;
            }

            case 'levelButton13': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': false});
                break;
            }

            case 'levelButton14': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': false});
                break;
            }

            case 'levelButton21': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': true});
                break;
            }

            case 'levelButton22': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': true});
                break;
            }

            case 'levelButton23': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': true});
                break;
            }

            case 'levelButton24': {
                this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': true});
                break;
            }

            case 'levelButton31': {
                this.transitionOut('RestrictedSortingSceneLoader', {'level': 1});
                break;
            }

            case 'levelButton32': {
                this.transitionOut('RestrictedSortingSceneLoader', {'level': 2});
                break;
            }

            case 'levelButton33': {
                this.transitionOut('GameSceneLoader', {'level': 1});
                break;
            }

            case 'levelButton34': {
                this.transitionOut('GameSceneLoader', {'level': 2});
                break;
            }
            default: {
                break;
            }
        }
    }
}
