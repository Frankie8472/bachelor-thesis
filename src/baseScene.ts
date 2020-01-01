export class BaseScene extends Phaser.Scene {
    /**
     * Name of the scene
     */
    protected key: string;

    /**
     * Level of the scene
     */
    protected level: number;

    /**
     * Transition graphic
     */
    private transition: Phaser.GameObjects.GameObject[];

    constructor(key: string) {
        super({
            key: key
        });

        this.key = key;
        this.level = 0;
        this.generateNewSeed();
    }

    /**
     * Method for returning the key of this scene
     */
    public getKey(): string {
        return this.key;
    }

    /**
     * Method for returning the key of this scene
     */
    public getLevel(): number {
        return this.level;
    }

    /**
     * Method for generating a new seed so that pseudo randomness is guaranteed
     */
    private generateNewSeed(): void {
        const rndStr: string = Phaser.Math.RND.realInRange(Math.pow(10, 2), Math.pow(10,10)).toString();
        Phaser.Math.RND.sow([rndStr]);
    }

    /**
     * Method for initializing the shape, position and properties of the graphical scene transition
     */
    private transitionInit(): void {
        // Shape of the graphical transition
        const circle: Phaser.GameObjects.Graphics = this.add.graphics();

        // Shape of the screen
        const rectangle: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);

        // Define circle as the mask
        const mask: Phaser.Display.Masks.GeometryMask = circle.createGeometryMask();

        circle.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
        circle.fillCircle(0, 0, 0.1);
        circle.setDepth(0);

        mask.setInvertAlpha(true);

        rectangle.setDepth(1);
        rectangle.setOrigin(0, 0);
        rectangle.setMask(mask);

        circle.fillCircle(0, 0, 0.1);

        this.transition = [circle, rectangle];
    }

    /**
     * Opening transition. Normally used to visually introduce a new scene
     */
    protected transitionIn(): void {
        // Generating a new seed, so that randomness is guaranteed in every repetition of a scene
        this.generateNewSeed();

        this.transitionInit();

        this.children.bringToTop(this.transition[1]);

        const tween: Phaser.Tweens.Tween = this.add.tween({
            targets: this.transition[0],
            scale: 10 * 0.5 * Math.sqrt(Math.pow(this.cameras.main.width, 2) + Math.pow(this.cameras.main.height, 2)),
            ease: 'linear',
            duration: 700,
            onStart: () => this.sound.volume = 0
        });

        tween.on('update', () => this.sound.volume += 1/tween.duration);
    }

    /**
     * Closing transition. Normally used to visually close or stop a scene.
     * @param scene The scene you want to start next.
     * @param data Additional data you want to give to the next scene.
     */
    protected transitionOut(scene: string, data?: any): void {
        this.children.bringToTop(this.transition[1]);

        const tween: Phaser.Tweens.Tween = this.add.tween({
            targets: this.transition[0],
            scale: 0,
            ease: 'linear',
            duration: 700,
            onComplete: () => this.sceneChange(scene, data)
        });

        tween.on('update', () => this.sound.volume -= 1/tween.duration);
    }

    /**
     * Helper method for starting a new scene and stopping the current one
     * as the behaviour of the current scene when starting a new one is
     * not clearly defined in the framework at this point of time.
     * @param scene The scene you want to start next
     * @param data Additional data you want to give to the next scene.
     */
    protected sceneChange(scene: string, data?: any): void {
        this.sound.stopAll();
        this.game.scene.start(scene, data);
        this.game.scene.stop(this.key);
    }

    /**
     * Helper method for playing the introduction and pause the current scene
     */
    protected introduction(): void {
        this.scene.pause();
        this.game.scene.start("IntroScene", {'pausedScene': this.getKey(), 'level': this.getLevel()});
    }

    /**
     * Returns the correct scaling factor for the wanted image size in relation to the real image size.
     * @param wantedImageSize Image size you want to have for a dimension
     * @param realImageSizeWidth The image width you want to scale
     * @param realImageSizeHeight The image height you want to scale
     * @param scaleToHeight Boolean for scaling height or width of image to the wanted size. Default to false.
     */
    protected imageScalingFactor(wantedImageSize: number, realImageSizeWidth: number, realImageSizeHeight: number, scaleToHeight: boolean = false): number {
        let ret: number;
        if (scaleToHeight) {
            ret = Math.max(wantedImageSize / realImageSizeWidth, wantedImageSize / realImageSizeHeight);
        } else {
            ret = Math.min(wantedImageSize / realImageSizeWidth, wantedImageSize / realImageSizeHeight);
        }
        return ret;
    }
}
