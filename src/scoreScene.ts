import 'phaser';
import {BaseScene} from './baseScene';

export class ScoreScene extends BaseScene {
    /**
     * Game score
     */
    private score: number;

    /**
     * Name and level of the previous scene
     */
    private previousScene: string;

    /**
     * Standard size of a button
     */
    private buttonSize: number;

    constructor() {
        super('ScoreScene');
    }

    init(data): void {
        // Initialize data from previous scene
        this.score = data.score;
        this.previousScene = data.previousScene;
        this.buttonSize = 64;
    }

    preload(): void {

    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.transitionIn();

        this.setBackground();
        this.initUI();
        this.initInput();
        this.initAudio();
    }

    /**
     * Method for initializing the background
     */
    private setBackground(): void {
        const background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'background5');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setInteractive({ cursor: 'pointer' });
    }

    /**
     * Method for initializing replaybutton and reward graphics
     */
    private initUI(): void {
        // Add replay button
        const replayButton: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - 100 + 34, this.cameras.main.height - 100 + 34, 'replay');
        replayButton.setOrigin(0.5, 0.5);
        const buttonScale: number = this.imageScalingFactor(this.buttonSize*1.5, replayButton.width, replayButton.height);
        replayButton.setScale(buttonScale);
        replayButton.setInteractive({ cursor: 'pointer' });
        replayButton.on('pointerdown', function() {
            replayButton.on('pointerup', function() {
                this.transitionOut(this.previousScene.substring(0, this.previousScene.length-1), {level: Number(this.previousScene[this.previousScene.length-1])});
            }, this);
        }, this);

        let star: string;

        if (this.score < 0.2) {
            star = 'star_0';
        } else if (this.score < 0.6) {
            star = 'star_1';
        } else if (this.score + Phaser.Math.EPSILON < 1) {
            star = 'star_2';
        } else {
            star = 'star_3';
        }
        this.saveScore(star);

        let sprite: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, star);

        sprite.setOrigin(0.5, 0.5);
        const starScale: number = this.imageScalingFactor(this.cameras.main.width*3/5, sprite.height, sprite.width);
        sprite.setScale(starScale);
        sprite.setData('scale', starScale);
        sprite.setInteractive({ cursor: 'pointer' });

        const starTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: sprite,
            ease: 'Linear',
            scale: 1.1*sprite.getData('scale'),
            repeat: 1000,
            yoyo: true,
            duration: 1000
        });

        // Add finger
        const finger: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, 6/7*this.cameras.main.height, 'finger');
        const fingerScale: number = this.imageScalingFactor(1/6*this.cameras.main.height, finger.width, finger.height, true);
        finger.setOrigin(0.5, 0.5);
        finger.setScale(fingerScale);
        finger.setInteractive({ cursor: 'pointer' });

        const fingerTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: finger,
            alpha: 0.1,
            ease: 'Linear',
            repeat: 1000,
            yoyo: true,
            duration: 1000
        });
    }

    /**
     * Method which initializes all global input actions
     */
    private initInput(): void {
        this.input.on('pointerdown', function() {
            this.input.on('pointerup', function() {
                this.transitionOut('LevelMenuScene');
            }, this);
        }, this);
    }

    /**
     * Method for initializing sound effects
     */
    private initAudio(): void {
        if (this.score + Phaser.Math.EPSILON < 1) {
            this.sound.add('lose').play();
        } else {
            this.sound.add('win').play();
        }
    }

    /**
     * Method for saving the score global
     */
    private saveScore(score: string): void {
        window.localStorage.setItem('phaser_score_' + this.previousScene, score);
    }
}
