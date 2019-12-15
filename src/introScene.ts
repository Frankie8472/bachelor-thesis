import 'phaser';
import {BaseScene} from './BaseScene';

export class IntroScene extends BaseScene {

    private pausedScene: string;

    private resume: boolean;

    constructor() {
        super('IntroScene');
    }

    init(data): void {
        this.pausedScene = data.pausedScene;
        this.resume = false;
    }

    preload(): void {
        // Load UI
        this.load.image('intro', 'assets/ui/gameintro.png');
    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.game.scene.moveUp(this.getKey());

        const background: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height);
        background.setOrigin(0, 0);
        background.setFillStyle(0x000000);
        background.setAlpha(0.01);

        const intro: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, 'intro')
        intro.setOrigin(0.5, 0.5);

        const scale: number = this.imageScalingFactor(this.cameras.main.width*3/5, intro.width, intro.height);
        intro.setScale(scale, scale);

        intro.setY(0);

        const introTweenIn: Phaser.Tweens.Tween = this.tweens.add({
            targets: intro,
            y: this.cameras.main.height/2,
            ease: 'linear',
            duration: 500,
            onComplete: () => this.initInput(intro, background)
        });

        const bgTweenIn: Phaser.Tweens.Tween = this.tweens.add({
            targets: background,
            alpha: 0.8,
            ease: 'linear',
            duration: 500
        });
    }

    private initInput(intro: Phaser.GameObjects.Sprite, bg: Phaser.GameObjects.Rectangle) {
        this.input.on('pointerdown', function(){
            this.input.on('pointerup', function(){
                this.resume = true;
                const introTweenOut: Phaser.Tweens.Tween = this.tweens.add({
                    targets: intro,
                    y: -300,
                    ease: 'linear',
                    duration: 200,
                    onComplete: function() {
                        this.game.scene.resume(this.pausedScene);
                        this.game.scene.stop(this.getKey());
                    }.bind(this)
                });

                const bgTweenOut: Phaser.Tweens.Tween = this.tweens.add({
                    targets: bg,
                    alpha: 0.01,
                    ease: 'linear',
                    duration: 200
                });
            }, this);
        }, this);
    }
}
