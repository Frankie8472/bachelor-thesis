import "phaser";

export class WelcomeScene extends Phaser.Scene {
    key: string = "WelcomeScene";
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    init(): void{

    }

    preload():void{
        this.load.image("background", "assets/ui/background1.png");
        this.load.image("title", "assets/ui/title.png");
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.sendToBack(this.key);

        let transition = this.transitionInit();
        this.transitionIn(transition);

        // Add background
        let background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Add title
        let title = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, "title");
        title.setScale(0.7, 0.7);
        title.setInteractive();

        let titleTween = this.tweens.add({
                targets: title,
                alpha: 0.7,
                ease: 'Linear',
                repeat: 1000,
                yoyo: true,
                duration: 1000
        });

        // Scene transition
        title.on("pointerup", () => this.transitionOut(transition, "LevelMenuScene"));
        return;
    }

    private transitionInit(): Phaser.GameObjects.Graphics {
        let circle = this.add.graphics();
        let mask = circle.createGeometryMask();
        let rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);

        circle.setPosition(this.cameras.main.width/2, this.cameras.main.height/2);
        circle.fillCircle(0, 0, 0.1);

        mask.setInvertAlpha(true);

        rectangle.setDepth(2);
        rectangle.setOrigin(0, 0);
        rectangle.setMask(mask);

        circle.fillCircle(0, 0, 0.1);

        return circle;
    }

    private transitionIn(circle: Phaser.GameObjects.Graphics): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 10*0.5*Math.sqrt(Math.pow(this.cameras.main.width, 2) + Math.pow(this.cameras.main.height, 2)),
            ease: 'linear',
            duration: 700,
        });
    }

    private transitionOut(circle: Phaser.GameObjects.Graphics, scene: string, data?: any): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 0,
            ease: 'linear',
            duration: 700,
            onComplete: () => this.sceneChange(scene, data)
        });
        return;
    }

    private sceneChange(scene: string, data?: any):void {
        this.game.scene.start(scene, data);
        this.game.scene.stop(this.key);
        return;
    }
}
