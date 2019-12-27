export class BaseScene extends Phaser.Scene {
    /**
     * Name of the scene
     */
    protected key: string;

    /**
     * Transition graphic
     */
    private transition: Phaser.GameObjects.GameObject[];

    constructor(key: string) {
        super({
            key: key
        });

        this.key = key;
        this.generateNewSeed();
    }

    /**
     * Function for returning the key of this scene
     */
    public getKey(): string{
        return this.key;
    }

    /**
     * Function for generating a new seed so that pseudo randomness is guaranteed
     */
    private generateNewSeed(): void {
        const rndStr: string = Phaser.Math.RND.realInRange(Math.pow(10, 2), Math.pow(10,10)).toString();
        Phaser.Math.RND.sow([rndStr]);
    }

    /**
     * Function for initializing the shape, position and properties of the graphical scene transition
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
            duration: 700
        });
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
    }

    /**
     * Helper function for starting a new scene and stopping the current one
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


    /**
     * Returns random coordinates in the requested quadrant of total quadrants.
     * Starting by 0, from left to right then from top to bottom.
     * IMPORTANT: Sprite origin has to be (0.5, 0.5)!
     * @param quadrant Number of the quadrant
     * @param quadrantType Number of quadrants
     * @param cardDisplaySize Size of the displayed object for returning coordinates inside the visible object boundaries
     */
    protected returnQuad(quadrant: number, quadrantType: number, cardDisplaySize: number): number[] {
        let ret: number[] = null;

        if (quadrant >= quadrantType) {
            console.log('ERROR: quadrant >= quadrantType');
            return ret;
        }

        const spriteSizeHalf: number = cardDisplaySize / 2 + 10;

        const leftOffsite: number = 100;
        const rightOffsite: number = 0;
        const topOffsite: number = 0;
        const bottomOffsite: number = 100;

        // Has entries dependant of
        const horizontal: number[] = [];

        // Has numberOfLines + 1 entries
        const vertical: number[] = [];

        horizontal.push(leftOffsite);

        vertical.push(topOffsite);

        switch (quadrantType) {
            case 3: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite) / 3);
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite) * 2 / 3);
                break;
            }
            case 4: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite) / 2);
                vertical.push(topOffsite + (this.cameras.main.height - topOffsite - bottomOffsite) / 2);
                break;
            }
            case 6: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite) / 3);
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite) * 2 / 3);
                vertical.push(topOffsite + (this.cameras.main.height - topOffsite - bottomOffsite) / 2);
                break;
            }
            default: {
                break;
            }
        }

        horizontal.push(this.cameras.main.width - rightOffsite);
        vertical.push(this.cameras.main.height - bottomOffsite);

        switch (quadrantType) {
            case 3: {
                ret = [Phaser.Math.RND.between(horizontal[quadrant] + spriteSizeHalf, horizontal[quadrant + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[0] + spriteSizeHalf + this.cameras.main.height / 8, vertical[1] - spriteSizeHalf - this.cameras.main.height / 8)];
                break;
            }
            case 4: {
                if (quadrant < 2) {
                    ret = [Phaser.Math.RND.between(horizontal[quadrant] + spriteSizeHalf, horizontal[quadrant + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[0] + spriteSizeHalf, vertical[1] - spriteSizeHalf)];
                } else {
                    ret = [Phaser.Math.RND.between(horizontal[quadrant % 2] + spriteSizeHalf, horizontal[(quadrant % 2) + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[1] + spriteSizeHalf, vertical[2] - spriteSizeHalf)];

                }
                break;
            }
            case 6: {
                if (quadrant < 3) {
                    ret = [Phaser.Math.RND.between(horizontal[quadrant] + spriteSizeHalf, horizontal[quadrant + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[0] + spriteSizeHalf, vertical[1] - spriteSizeHalf)];
                } else {
                    ret = [Phaser.Math.RND.between(horizontal[quadrant % 3] + spriteSizeHalf, horizontal[(quadrant % 3) + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[1] + spriteSizeHalf, vertical[2] - spriteSizeHalf)];
                }
                break;
            }
            default: {
                break;
            }
        }
        return ret;
    }
}
