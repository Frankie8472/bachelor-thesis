import 'phaser';
import {BaseScene} from './BaseScene';

export class ScoreScene extends BaseScene {
    /**
     * Game score
     */
    private score: number;

    /**
     * Name of the previous scene
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
        // Preload UI
        if (this.textures.exists('gamebackground')){
            this.textures.remove('gamebackground')
        }
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('star_0', 'assets/ui/star_0.png');
        this.load.image('star_1', 'assets/ui/star_1.png');
        this.load.image('star_2', 'assets/ui/star_2.png');
        this.load.image('star_3', 'assets/ui/star_3.png');
        this.load.image('replay', 'assets/ui/reload_button.png');

        this.load.audio('sparkle', 'assets/ui_audio/sparkle_loop.mp3');
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
     * Function for initializing the background
     */
    private setBackground() {
        const background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    }

    /**
     * Function for initializing replaybutton and reward graphics
     */
    private initUI() {
        // Add replay button
        const replayButton: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - 100 + 34, this.cameras.main.height - 100 + 34, 'replay');
        replayButton.setOrigin(0.5, 0.5);
        const buttonScale: number = this.imageScalingFactor(this.buttonSize*1.5, replayButton.width, replayButton.height);
        replayButton.setScale(buttonScale, buttonScale);
        replayButton.setInteractive();
        replayButton.on('pointerdown', function() {
            replayButton.on('pointerup', function() {
                this.transitionOut(this.previousScene);
            }, this);
        }, this);

        let sprite: Phaser.GameObjects.Sprite;

        if (this.score < 0.2) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_0');
        } else if (this.score < 0.6) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_1');
        } else if (this.score < 1) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_2');
        } else {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_3');
        }

        sprite.setOrigin(0.5, 0.5);
        const starScale: number = this.imageScalingFactor(this.cameras.main.width*3/5, sprite.height, sprite.width);
        sprite.setScale(starScale, starScale);
        sprite.setData('scale', starScale);

        const starTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: sprite,
            ease: 'Linear',
            scale: 1.1*sprite.getData('scale'),
            repeat: 1000,
            yoyo: true,
            duration: 1000
        });
    }

    /**
     * Function which initializes all global input actions
     */
    private initInput() {
        this.input.on('pointerdown', function() {
            this.input.on('pointerup', function() {
                this.transitionOut('LevelMenuScene');
            }, this);
        }, this);
    }

    /**
     * Function for initializing soundeffects
     */
    private initAudio() {
        this.sound.add('sparkle').play('', {loop: false});
    }
}
