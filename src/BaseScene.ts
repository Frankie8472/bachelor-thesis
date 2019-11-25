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
     * Returns random coordinates in the requested quadrant of total quadrants.
     * Starting by 0, from left to right then from top to bottom.
     * IMPORTANT: Sprite origin has to be (0.5, 0.5)!
     * @param quadrant Number of the quadrant
     * @param quadrantType Number of quadrants
     * @param cardDisplaySize Size of the displayed object for returning coordinates inside the visible object boundaries
     */
    protected returnQuad(quadrant: number, quadrantType: number, cardDisplaySize: number): number[] {
        let ret = null;

        if (quadrant >= quadrantType) {
            console.log("ERROR: quadrant >= quadrantType");
            return ret;
        }

        let spriteSizeHalf = cardDisplaySize / 2;

        let leftOffsite = 100;
        let rightOffsite = 0;
        let topOffsite = 0;
        let bottomOffsite = 100;

        // Has entries dependant of
        let horizontal = [];

        // Has numberOfLines + 1 entries
        let vertical = [];

        horizontal.push(leftOffsite);

        vertical.push(topOffsite);

        switch (quadrantType) {
            case 3: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite)/3);
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite)*2/3);
                break;
            }
            case 4: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite)/2);
                vertical.push(topOffsite + (this.cameras.main.height - topOffsite - bottomOffsite)/2);
                break;
            }
            case 6: {
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite)/3);
                horizontal.push(leftOffsite + (this.cameras.main.width - leftOffsite - rightOffsite)*2/3);
                vertical.push(topOffsite + (this.cameras.main.height - topOffsite - bottomOffsite)/2);
                break;
            }
            default: {
                break;
            }
        }

        horizontal.push(this.cameras.main.width - rightOffsite);
        vertical.push(this.cameras.main.height - bottomOffsite);

        ret = [Phaser.Math.RND.between(horizontal[quadrant] + spriteSizeHalf, horizontal[quadrant + 1] - spriteSizeHalf), Phaser.Math.RND.between(vertical[quadrant] + spriteSizeHalf, vertical[quadrant + 1] - spriteSizeHalf)];
        return ret;
    }
}
