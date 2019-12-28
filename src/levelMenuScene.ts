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

    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.transitionIn();

        this.setBackground();
        this.setTitle();
        this.setVisualLink();
        this.setLevelButtons();
        this.setStars();
        this.initInput();
        this.initAudio();
    }

    update(time: number): void {

    }

    /**
     * Method for initializing background graphics
     */
    private setBackground() {
        const background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'background1');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    }

    /**
     * Method for initializing the level buttons and their onclick action
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
        catButton.setInteractive({cursor: 'pointer'});

        this.levelButtons.getChildren().forEach(function(gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setName(gameObject.texture.key);
                gameObject.setOrigin(0.5, 0.5);

                const scale: number = this.imageScalingFactor(this.buttonSize, gameObject.width, gameObject.height);
                gameObject.setScale(scale, scale);

                gameObject.setData('clicked', false);

                gameObject.setInteractive({cursor: 'pointer'});
            }
        }, this);

        this.levelButtons.add(catButton);
    }

    /**
     * Method for initializing all input
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
     * Method for assigning each button an event function
     * @param gameObject GameObject on which you want the function on
     */
    private buttonFunction(gameObject: Phaser.GameObjects.Sprite): void {
        let name: string = this.buttonToSceneMap(gameObject.name);
        let level: number = Number(name[name.length-1]);

        switch (gameObject.name) {
            case 'catButton': {
                this.transitionOut(name);
                break;
            }
            case 'levelButton11': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton12': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton13': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton14': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton21': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton22': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton23': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton24': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton31': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton32': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton33': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'levelButton34': {
                name = name.substring(0, name.length-1);
                this.transitionOut(name, {'level': level});
                break;
            }

            case 'title': {
                this.transitionOut(name);
                break;
            }

            default: {
                break;
            }
        }
    }

    /**
     * Method for initializing title and animation
     */
    private setTitle() {
        // Add title
        const y: number = (this.cameras.main.height / 4 - this.buttonSize / 2) / 2;
        const title: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, y, 'title');
        const titleScale: number = this.imageScalingFactor(y * 1.3, title.width, title.height, true);
        title.setOrigin(0.5, 0.5);
        title.setScale(titleScale, titleScale);
        title.setName('title');
        title.setInteractive({cursor: 'pointer'});
    }

    /**
     * Method for initializing the dashed line under the level buttons
     */
    private setVisualLink() {
        // Add lines
        const dashedLine1: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 1 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine1.setFillStyle(0x000000);
        dashedLine1.setOrigin(0.5, 0.5);
        dashedLine1.setAltFillStyle(0x000000, 0);

        const dashedLine2: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 2 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine2.setFillStyle(0x000000);
        dashedLine2.setOrigin(0.5, 0.5);
        dashedLine2.setAltFillStyle(0x000000, 0);

        const dashedLine3: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 3 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine3.setFillStyle(0x000000);
        dashedLine3.setOrigin(0.5, 0.5);
        dashedLine3.setAltFillStyle(0x000000, 0);
    }

    /**
     * Method for initializing sound effects
     */
    private initAudio() {
        this.sound.add('loading').play('', {loop: true});
    }

    /**
     * Method for retrieving scene the respective button leads to with level at the end of the string
     * @param buttonName Name of the button
     */
    private buttonToSceneMap(buttonName: string): string {
        let ret: string = "";

        switch (buttonName) {
            case 'catButton': {
                ret = 'SortingScene';
                break;
            }
            case 'levelButton11': {
                ret = 'PropertySortingScene1';
                break;
            }

            case 'levelButton12': {
                ret = 'PropertySortingScene2';

                break;
            }

            case 'levelButton13': {
                ret = 'PropertySortingScene3';
                break;
            }

            case 'levelButton14': {
                ret = 'PropertySortingScene4';
                break;
            }

            case 'levelButton21': {
                ret = 'PropertySortingScene5';
                break;
            }

            case 'levelButton22': {
                ret = 'PropertySortingScene6';
                break;
            }

            case 'levelButton23': {
                ret = 'PropertySortingScene7';
                break;
            }

            case 'levelButton24': {
                ret = 'PropertySortingScene8';
                break;
            }

            case 'levelButton31': {
                ret = 'RestrictedSortingScene1';
                break;
            }

            case 'levelButton32': {
                ret = 'RestrictedSortingScene2';
                break;
            }

            case 'levelButton33': {
                ret = 'GameScene1';
                break;
            }

            case 'levelButton34': {
                ret = 'GameScene2';
                break;
            }

            case 'title': {
                ret = 'WelcomeScene';
                break;
            }

            default: {
                break;
            }
        }
        return ret;
    }

    /**
     * Method for initializing or resetting the (previous/default) score
     */
    private setStars(reset: boolean = false) {
        this.levelButtons.getChildren().forEach(function(gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite && gameObject.name != "catButton") {
                let score: string = 'star_0';
                if(window.localStorage.getItem('phaser_score_' + this.buttonToSceneMap(gameObject.name))){
                    if (reset) {
                        window.localStorage.setItem('phaser_score_' + this.buttonToSceneMap(gameObject.name), score);
                    } else {
                        score = window.localStorage.getItem('phaser_score_' + this.buttonToSceneMap(gameObject.name));
                    }
                }
                const star: Phaser.GameObjects.Sprite = this.add.sprite(gameObject.getBottomCenter().x, gameObject.getBottomCenter().y, score);
                const scale: number = this.imageScalingFactor((gameObject.getTopRight().x - gameObject.getTopLeft().x)/2, star.width, star.height);
                star.setScale(scale, scale);
                star.setOrigin(0.5, 0.5);
            }
        }, this);
    }
}
