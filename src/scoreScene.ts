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

    constructor() {
        super('ScoreScene');
    }

    init(data): void {
        // Initialize data from previous scene
        this.score = data.score;
        this.previousScene = data.previousScene;
    }

    preload(): void {
        // Preload UI
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('star_0', 'assets/ui/star_0.png');
        this.load.image('star_1', 'assets/ui/star_1.png');
        this.load.image('star_2', 'assets/ui/star_2.png');
        this.load.image('star_3', 'assets/ui/star_3.png');
        this.load.image('replay', 'assets/ui/reload_button.png');
    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.key);
        this.transitionIn();

        this.setBackground();
        this.initUI();
        this.initInput();
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
        const replayButton: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - 100, this.cameras.main.height - 100, 'replay');
        replayButton.setOrigin(0.5, 0.5);
        replayButton.setScale(0.5, 0.5);
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

        const starTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: sprite,
            ease: 'Linear',
            scale: 1.1,
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
}
