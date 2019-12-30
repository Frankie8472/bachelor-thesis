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
        const eraseButton: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - 20, this.cameras.main.height - 20, 'erase');
        const levelButton11: Phaser.GameObjects.Sprite = this.add.sprite(1 / 5 * this.cameras.main.width, 1 / 4 * this.cameras.main.height, 'levelButton11');
        const levelButton12: Phaser.GameObjects.Sprite = this.add.sprite(2 / 5 * this.cameras.main.width, 1 / 4 * this.cameras.main.height, 'levelButton12');
        const levelButton13: Phaser.GameObjects.Sprite = this.add.sprite(3 / 5 * this.cameras.main.width, 1 / 4 * this.cameras.main.height, 'levelButton13');
        const levelButton14: Phaser.GameObjects.Sprite = this.add.sprite(4 / 5 * this.cameras.main.width, 1 / 4 * this.cameras.main.height, 'levelButton14');
        const levelButton21: Phaser.GameObjects.Sprite = this.add.sprite(4 / 5 * this.cameras.main.width, 2 / 4 * this.cameras.main.height, 'levelButton21');
        const levelButton22: Phaser.GameObjects.Sprite = this.add.sprite(3 / 5 * this.cameras.main.width, 2 / 4 * this.cameras.main.height, 'levelButton22');
        const levelButton23: Phaser.GameObjects.Sprite = this.add.sprite(2 / 5 * this.cameras.main.width, 2 / 4 * this.cameras.main.height, 'levelButton23');
        const levelButton24: Phaser.GameObjects.Sprite = this.add.sprite(1 / 5 * this.cameras.main.width, 2 / 4 * this.cameras.main.height, 'levelButton24');
        const levelButton31: Phaser.GameObjects.Sprite = this.add.sprite(1 / 5 * this.cameras.main.width, 3 / 4 * this.cameras.main.height, 'levelButton31');
        const levelButton32: Phaser.GameObjects.Sprite = this.add.sprite(2 / 5 * this.cameras.main.width, 3 / 4 * this.cameras.main.height, 'levelButton32');
        const levelButton33: Phaser.GameObjects.Sprite = this.add.sprite(3 / 5 * this.cameras.main.width, 3 / 4 * this.cameras.main.height, 'levelButton33');
        const levelButton34: Phaser.GameObjects.Sprite = this.add.sprite(4 / 5 * this.cameras.main.width, 3 / 4 * this.cameras.main.height, 'levelButton34');

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
        eraseButton.setOrigin(1, 1);

        const scaleCatButton: number = this.imageScalingFactor(this.buttonSize / 1.5, catButton.width, catButton.height);
        catButton.setScale(scaleCatButton, scaleCatButton);
        catButton.setName('catButton');
        catButton.setInteractive({cursor: 'pointer'});

        const scaleEraseButton: number = this.imageScalingFactor(this.buttonSize / 1.5, eraseButton.width, eraseButton.height);
        eraseButton.setScale(scaleEraseButton, scaleEraseButton);
        eraseButton.setName('eraseButton');
        eraseButton.setInteractive({cursor: 'pointer'});

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
        this.levelButtons.add(eraseButton);
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

            case 'eraseButton': {
                this.setStars(true);
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
        const alpha: number = 0.5;

        // Add lines
        const dashedLine1: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 1 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine1.setFillStyle(0x000000);
        dashedLine1.setOrigin(0.5, 0.5);
        dashedLine1.setAltFillStyle(0x000000, 0);
        dashedLine1.setAlpha(alpha);

        const dashedLine2: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 2 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine2.setFillStyle(0x000000);
        dashedLine2.setOrigin(0.5, 0.5);
        dashedLine2.setAltFillStyle(0x000000, 0);
        dashedLine2.setAlpha(alpha);

        const dashedLine3: Phaser.GameObjects.Grid = this.add.grid(this.cameras.main.width / 2, 3 / 4 * this.cameras.main.height, 3 / 5 * this.cameras.main.width, this.buttonSize / 6, this.buttonSize / 10, this.buttonSize / 6);
        dashedLine3.setFillStyle(0x000000);
        dashedLine3.setOrigin(0.5, 0.5);
        dashedLine3.setAltFillStyle(0x000000, 0);
        dashedLine3.setAlpha(alpha);

        // Connecting half circles
        const circle12 = this.add.graphics();
        circle12.lineStyle(this.buttonSize / 6, 0x000000, 1);
        circle12.beginPath();
        circle12.arc(4 / 5 * this.cameras.main.width + this.cameras.main.height / 12, 1 / 4 * this.cameras.main.height + this.cameras.main.height / 8, this.cameras.main.height / 8, - Math.PI/2, Math.PI/2, false);
        circle12.strokePath();
        circle12.setAlpha(alpha);

        const circle23 = this.add.graphics();
        circle23.lineStyle(this.buttonSize / 6, 0x000000, 1);
        circle23.beginPath();
        circle23.arc(1 / 5 * this.cameras.main.width - this.cameras.main.height / 12, 2 / 4 * this.cameras.main.height + this.cameras.main.height / 8, this.cameras.main.height / 8, - Math.PI/2, Math.PI/2, true);
        circle23.strokePath();
        circle23.setAlpha(alpha);


        // Triangle for indicating starting point
        const triSize: number = this.buttonSize/3;
        const startX: number = 1 / 5 * this.cameras.main.width - this.cameras.main.height / 8 + triSize - 10;
        const startY: number = 1 / 4 * this.cameras.main.height + triSize;
        const startTriangle1: Phaser.GameObjects.Triangle = this.add.triangle(startX, startY, 0, 0,- triSize, - triSize, - triSize, triSize, 0x000000, 1);
        const startTriangle2: Phaser.GameObjects.Triangle = this.add.triangle(startX - 1/2*triSize, startY, 0, 0,- triSize, - triSize, - triSize, triSize, 0x000000, 1);
        const startTriangle3: Phaser.GameObjects.Triangle = this.add.triangle(startX - 2/2*triSize, startY, 0, 0,- triSize, - triSize, - triSize, triSize, 0x000000, 1);

        startTriangle1.setAlpha(alpha);
        startTriangle2.setAlpha(alpha);
        startTriangle3.setAlpha(alpha);

        // Orange Square indicating the final level
        const size: number = this.buttonSize*1.2;
        const bossField: Phaser.GameObjects.Graphics = this.add.graphics();
        bossField.fillStyle(0xfa7500, 0.3);
        bossField.fillRoundedRect(4 / 5 * this.cameras.main.width - size/2, 3 / 4 * this.cameras.main.height - size/2, size, size, this.buttonSize/20);

        const bossTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: bossField,
            alpha: 0.1,
            ease: 'Linear',
            repeat: 1000,
            yoyo: true,
            duration: 1000
        });
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
            if (gameObject instanceof Phaser.GameObjects.Sprite && gameObject.name != "catButton" && gameObject.name != 'eraseButton') {
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
