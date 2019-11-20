export class BaseScene extends Phaser.Scene {
    protected key: string;
    private transition: Phaser.GameObjects.Graphics;

    constructor(key: string) {
        super({
            key: key
        });
        this.key = key;
    }

    /**
     * Function for initializing the shape, position and properties of the graphical scene transition
     */
    private transitionInit(): void {
        let circle = this.add.graphics();
        let mask = circle.createGeometryMask();
        let rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);

        circle.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
        circle.fillCircle(0, 0, 0.1);

        mask.setInvertAlpha(true);

        rectangle.setDepth(2);
        rectangle.setOrigin(0, 0);
        rectangle.setMask(mask);

        circle.fillCircle(0, 0, 0.1);

        this.transition = circle;

        return;
    }

    /**
     * Opening transition. Normally used to visually introduce a new scene
     */
    protected transitionIn(): void {
        this.transitionInit();

        let tween = this.add.tween({
            targets: this.transition,
            scale: 10 * 0.5 * Math.sqrt(Math.pow(this.cameras.main.width, 2) + Math.pow(this.cameras.main.height, 2)),
            ease: 'linear',
            duration: 700,
        });
    }

    /**
     * Closing transition. Normally used to visually close or stop a scene.
     * @param scene The scene you want to start next.
     * @param data Additional data you want to give to the next scene.
     */
    protected transitionOut(scene: string, data?: any): void {

        let tween = this.add.tween({
            targets: this.transition,
            scale: 0,
            ease: 'linear',
            duration: 700,
            onComplete: () => this.sceneChange(scene, data)
        });
        return;
    }

    /**
     * Helper function for starting a new scene and stopping the current one
     * as the behaviour of the current scene when starting a new one is
     * not clearly defined in the framework at this point of time.
     * @param scene The scene you want to start next
     * @param data Additional data you want to give to the next scene.
     */
    protected sceneChange(scene: string, data?: any): void {
        this.game.scene.start(scene, data);
        this.game.scene.stop(this.key);
        return;
    }

    /**
     * Returns the correct scaling factor for the wanted image size in relation to the real image size.
     * @param wantedImageSize
     * @param realImageSizeWidth
     * @param realImageSizeHeight
     */
    protected imageScalingFactor(wantedImageSize: number, realImageSizeWidth: number, realImageSizeHeight: number): number {
        return Math.min(wantedImageSize / realImageSizeWidth, wantedImageSize / realImageSizeHeight);
    }

    /**
     * Returns random coordinates in the defined quadrant.
     * #########
     * # 0 # 1 #
     * #########
     * # 2 # 3 #
     * #########
     *
     * @param quad Number of the quadrant.
     * @param cardDisplaySize Size of the displayed object for returning coordinates inside the visible object boundaries
     */
    protected returnQuad(quad: number, cardDisplaySize: number): number[] {
        let spritesize = cardDisplaySize;
        let ret = null;
        let leftBound = 100 + spritesize / 2;
        let rightBound = this.cameras.main.width - spritesize / 2;
        let topBound = spritesize / 2;
        let botBound = this.cameras.main.height - 100 - spritesize / 2;
        let horizontalMid = topBound + (botBound - topBound) / 2;
        let verticalMid = leftBound + (rightBound - leftBound) / 2;

        switch (quad) {
            case 0: {
                ret = [Phaser.Math.RND.between(leftBound, verticalMid - spritesize / 2), Phaser.Math.RND.between(topBound, horizontalMid - spritesize / 2)];
                break;
            }

            case 1: {
                ret = [Phaser.Math.RND.between(verticalMid + spritesize / 2, rightBound), Phaser.Math.RND.between(topBound, horizontalMid - spritesize / 2)];

                break;
            }

            case 2: {
                ret = [Phaser.Math.RND.between(leftBound, verticalMid - spritesize / 2), Phaser.Math.RND.between(horizontalMid + spritesize / 2, botBound)];

                break;
            }

            case 3: {
                ret = [Phaser.Math.RND.between(verticalMid + spritesize / 2, rightBound), Phaser.Math.RND.between(horizontalMid + spritesize / 2, botBound)];
                break;
            }

            default: {
                break;
            }
        }
        return ret;
    }
}
