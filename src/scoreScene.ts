import 'phaser';
import {BaseScene} from './BaseScene';

export class ScoreScene extends BaseScene {
    private score: number;
    private previousScene: string;

    constructor() {
        super('ScoreScene');
    }

    init(data): void {
        this.score = data.score;
        this.previousScene = data.previousScene;
    }

    preload(): void {
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('star_0', 'assets/ui/star_0.png');
        this.load.image('star_1', 'assets/ui/star_1.png');
        this.load.image('star_2', 'assets/ui/star_2.png');
        this.load.image('star_3', 'assets/ui/star_3.png');
        this.load.image('replay', 'assets/ui/reload_button.png');
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.sendToBack(this.key);

        let background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        //background.setTint(0xffccaa);
        //background.setAlpha(0.9);

        // Add replay button
        let replayButton = this.add.sprite(this.cameras.main.width - 100, this.cameras.main.height - 100, 'replay');
        replayButton.setOrigin(0.5, 0.5);
        replayButton.setScale(0.5, 0.5);
        replayButton.setInteractive();
        replayButton.on('pointerdown', function() {
            this.scene.start(this.previousScene);
            this.scene.stop(this.key);
        }, this);

        let sprite: Phaser.GameObjects.Sprite;

        if (this.score < 0.3) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_0');
        } else if (this.score < 0.6) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_1');
        } else if (this.score < 1 - Phaser.Math.EPSILON) {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_2');
        } else {
            sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star_3');
        }

        sprite.setOrigin(0.5, 0.5);

        this.input.on('pointerup', function(/*pointer*/) {
            this.scene.start('LevelMenuScene');
            this.scene.stop(this.key);
        }, this);

    }

}
