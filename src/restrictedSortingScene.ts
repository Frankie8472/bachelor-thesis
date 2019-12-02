import 'phaser';
import {BaseScene} from './BaseScene';

export class RestrictedSortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    private level: number;

    // Lock for 'pointerup' and 'drop' so not both will get triggered. First 'drop' triggers, then 'pointerup' on 'drop'.
    private dropped: boolean;
    /**
     * Image groups and containers
     */
    private dropZone1: Phaser.GameObjects.Group;
    private dropZone2: Phaser.GameObjects.Group;
    private dropZone3: Phaser.GameObjects.Group;

    constructor() {
        super('RestrictedSortingScene');
    }

    init(data): void {

        // Data from scene before
        this.jsonObject = data.jsonObject;
        this.level = data.setLevel;

        this.dropped = false;

        this.dropZone1 = this.add.group();
        this.dropZone2 = this.add.group();
        this.dropZone3 = this.add.group();
    }

    preload(): void {
        // TODO: Load UI
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('crate', 'assets/ui/crate_topview.png');

        // TODO: Preselect objects
        for (let image of this.jsonObject['images']) {

        }

        for (let cat of this.jsonObject['categories']) {

        }
        // TODO: Load objects
        // TODO: Load containers/dropzones
        // TODO: Load Progressbar?

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transitionIn();

        let background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);

        let crate1 = this.add.sprite(this.cameras.main.width*(1/6), this.cameras.main.height*(3/4),'crate');
        let crate2 = this.add.sprite(this.cameras.main.width*(3/6), this.cameras.main.height*(3/4),'crate');
        let crate3 = this.add.sprite(this.cameras.main.width*(5/6), this.cameras.main.height*(3/4),'crate');

        crate1.setOrigin(0.5, 0.5);
        crate2.setOrigin(0.5, 0.5);
        crate3.setOrigin(0.5, 0.5);

        let scale = this.imageScalingFactor(Math.min(this.cameras.main.width/3, this.cameras.main.height/2) - 40, crate1.width, crate1.height);
        crate1.setScale(scale, scale);
        crate2.setScale(scale, scale);
        crate3.setScale(scale, scale);

        for (let i: number = 0; i < 6; i++) {
            let heightPosition = 0;
            if (i > 2) {
                heightPosition = 1;
            }

            let x = crate1.x - crate1.width*scale/2;
            let y = crate1.y - crate1.height*scale/2;
            let zone = this.add.zone(x+(i%3)*crate1.width*scale/3, y+heightPosition*crate1.height*scale/2, crate1.width*scale/3, crate1.height*scale/2);
            zone.setRectangleDropZone(crate1.width*scale/3, crate1.height*scale/2);
            zone.setName("zone1");

            this.dropZone1.add(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);

        }

        for (let i: number = 0; i < 4; i++) {
            let heightPosition = 0;
            if (i > 1) {
                heightPosition = 1;
            }

            let x = crate2.x - crate2.width*scale/2;
            let y = crate2.y - crate2.height*scale/2;
            let zone = this.add.zone(x+(i%2)*crate2.width*scale/2, y+heightPosition*crate2.height*scale/2, crate2.width*scale/2, crate2.height*scale/2);
            zone.setRectangleDropZone(crate2.width*scale/2, crate2.height*scale/2);
            zone.setName("zone2");

            this.dropZone2.add(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }

        for (let i: number = 0; i < 2; i++) {
            let x = crate3.x - crate3.width*scale/2;
            let y = crate3.y - crate3.height*scale/2;
            let zone = this.add.zone(x+(i%2)*crate3.width*scale/2, y, crate3.width*scale/2, crate3.height*scale);
            zone.setRectangleDropZone(crate3.width*scale/2, crate3.height*scale);
            zone.setName("zone3");

            this.dropZone3.add(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }

        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setData('x', gameObject.x);
                gameObject.setData('y', gameObject.y);
                gameObject.input.dropZone = true;
            }
        }, this);

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.setPosition(dragX, dragY);
        }, this);

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            this.dropped = true;
            if (gameObject instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject.clearTint();
                let imageScale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height) * 0.4, gameObject.width, gameObject.height);
                gameObject.setScale(imageScale, imageScale);

                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;

                gameObject.input.dropZone = false;
            }
        }, this);


        let test = this.add.sprite(100, 100, 'crate');
        test.setOrigin(0.5,0.5);
        let scalet = this.imageScalingFactor(200, test.width, test.height);
        test.setScale(scalet, scalet);
        test.setInteractive();
        test.setTintFill(0x00ff00);
        this.input.setDraggable(test);

        let test2 = this.add.sprite(100, 100, 'crate');
        test2.setOrigin(0.5,0.5);
        test2.setScale(scalet, scalet);
        test2.setInteractive();
        test2.setTintFill(0xff0000);
        this.input.setDraggable(test2);

        // TODO: Display objects
        // TODO: Action on objects, drag and drop
        // TODO: Display dropzones
        // TODO: Action on dropzones, placement free + scaling accordingly, check if all objects are placed or simultaniously? how to display failure? rot markieren mit reset button und check button?
        // TODO: level 1 choose one category, level two categories can be mixed
        // TODO: placement in containers 6 4 2? absrpache mit elizabeta
    }

    update(time: number): void {

    }
}

