import 'phaser';
import {BaseScene} from './baseScene';
import AnimationManager = Phaser.Animations.AnimationManager;

export class IntroScene extends BaseScene {

    /**
     * Name of the paused scene the intro is currently playing for
     */
    private pausedScene: string;

    /**
     * Boolean, indicating if the paused scene should be resumed
     */
    private resume: boolean;

    constructor() {
        super('IntroScene');
    }

    init(data): void {
        this.pausedScene = data.pausedScene;
        this.level = data.level;
        this.resume = false;
    }

    preload(): void {

    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.game.scene.moveUp(this.getKey());

        if (this.getIntroData() == null) {
            this.scene.resume(this.pausedScene);
            this.scene.stop(this.getKey());
        } else {
            this.initIntro();
        }

    }

    /**
     * Method for initializing the introduction objects and animation
     */
    private initIntro(): void {
        const background: Phaser.GameObjects.Rectangle = this.setBackground();
        const intro: Phaser.GameObjects.Sprite = this.setIntro();

        const finger: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height-10, 'finger');
        const scale: number = this.imageScalingFactor(this.cameras.main.height/10, finger.width, finger.height);
        finger.setScale(scale, scale);
        finger.setOrigin(0.5, 1);

        this.setAnimation(intro, background, finger);
    }

    /**
     * Method for the input setup
     * @param intro
     * @param background
     */
    private initInput(intro: Phaser.GameObjects.Sprite, background: Phaser.GameObjects.Rectangle, finger: Phaser.GameObjects.Sprite): void {
        this.input.on('pointerdown', function () {
            this.input.on('pointerup', function () {
                this.resume = true;
                const introTweenOut: Phaser.Tweens.Tween = this.tweens.add({
                    targets: intro,
                    y: -300,
                    ease: 'linear',
                    duration: 200,
                    onComplete: function () {
                        this.scene.resume(this.pausedScene);
                        this.scene.stop(this.getKey());
                    }.bind(this)
                });

                const backgroundTweenOut: Phaser.Tweens.Tween = this.tweens.add({
                    targets: background,
                    alpha: 0.01,
                    ease: 'linear',
                    duration: 200
                });

                const fingerTweenOut: Phaser.Tweens.Tween = this.tweens.add({
                    targets: finger,
                    alpha: 0.01,
                    ease: 'linear',
                    duration: 200
                });

            }, this);
        }, this);
    }

    /**
     * Method for generating the background object
     */
    private setBackground(): Phaser.GameObjects.Rectangle {
        const background: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height);
        background.setOrigin(0, 0);
        background.setFillStyle(0x000000);
        background.setAlpha(0.01);

        return background;
    }

    /**
     * Method for generating the introduction object
     */
    private setIntro(): Phaser.GameObjects.Sprite {
        const data: [string, Phaser.Types.Animations.GenerateFrameNumbers] = this.getIntroData();

        const introConfig = {
            key: 'animateGif',
            frames: this.anims.generateFrameNumbers(data[0], data[1]),
            frameRate: 20,
            repeat: -1
        };

        if(this.anims.exists(introConfig.key)) {
            this.anims.remove(introConfig.key)
        }

        this.anims.create(introConfig);

        const intro: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, data[0]);
        intro.setOrigin(0.5, 0.5);

        const scale: number = this.imageScalingFactor(this.cameras.main.width * 4 / 5, intro.width, intro.height);
        intro.setScale(scale, scale);

        intro.setY(0);

        return intro;
    }

    /**
     * Method for the animation setup
     * @param intro The introduction gif/spritesheet
     * @param background The background
     */
    private setAnimation(intro: Phaser.GameObjects.Sprite, background: Phaser.GameObjects.Rectangle, finger: Phaser.GameObjects.Sprite) {
        const introTweenIn: Phaser.Tweens.Tween = this.tweens.add({
            targets: intro,
            y: this.cameras.main.height / 2,
            ease: 'linear',
            duration: 500,
            onComplete: () => this.initInput(intro, background, finger)
        });

        const backgroundTweenIn: Phaser.Tweens.Tween = this.tweens.add({
            targets: background,
            alpha: 0.8,
            ease: 'linear',
            duration: 500
        });

        const fingerTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: finger,
            alpha: 0.1,
            ease: 'Linear',
            repeat: 1000,
            yoyo: true,
            duration: 1000
        });

        intro.play('animateGif');
    }

    /**
     * Method for retrieving the correct introduction for the current scene
     */
    private getIntroData(): [string, Phaser.Types.Animations.GenerateFrameNumbers] {
        let ret: [string, Phaser.Types.Animations.GenerateFrameNumbers];

        switch (this.pausedScene + String(this.getLevel())) {
            case 'PropertySortingScene1': {
                ret = ['intro_sorting', {start: 0, end: 150, first: 150}];
                break;
            }

            case 'PropertySortingScene2': {
                ret = ['intro_sorting', {start: 0, end: 150, first: 150}];
                break;
            }

            case 'PropertySortingScene3': {
                ret = ['intro_sorting', {start: 0, end: 150, first: 150}];
                break;
            }

            case 'PropertySortingScene4': {
                ret = ['intro_sorting', {start: 0, end: 150, first: 150}];
                break;
            }

            case 'PropertySortingScene5': {
                ret = ['intro_falling', {start: 0, end: 68, first: 68}];
                break;
            }

            case 'PropertySortingScene6': {
                ret = ['intro_falling', {start: 0, end: 68, first: 68}];
                break;
            }

            case 'PropertySortingScene7': {
                ret = ['intro_falling', {start: 0, end: 68, first: 68}];
                break;
            }

            case 'PropertySortingScene8': {
                ret = ['intro_falling', {start: 0, end: 68, first: 68}];
                break;
            }

            case 'RestrictedSortingScene1': {
                ret = ['intro_restricted', {start: 0, end: 201, first: 201}];
                break;
            }

            case 'RestrictedSortingScene2': {
                ret = ['intro_restricted', {start: 0, end: 201, first: 201}];
                break;
            }

            case 'GameScene1': {
                ret = ['intro_set_easy', {start: 0, end: 150, first: 225}];
                break;
            }

            case 'GameScene2': {
                ret = ['intro_set_hard', {start: 0, end: 150, first: 68}];
                break;
            }

            default: {
                ret = null;
                break;
            }
        }
        return ret;
    }
}
