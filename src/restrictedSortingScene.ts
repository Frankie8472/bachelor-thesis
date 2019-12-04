import 'phaser';
import {BaseScene} from './BaseScene';

export class RestrictedSortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    private level: number;

    private objectSize: number;

    private zoneObjMap: Phaser.GameObjects.Zone[];
    private objZoneMap: Phaser.GameObjects.Sprite[];

    /**
     * Image groups and containers
     */
    private dropZone1: Phaser.GameObjects.Group;
    private dropZone2: Phaser.GameObjects.Group;
    private dropZone3: Phaser.GameObjects.Group;

    private displayedObjects: any[];

    constructor() {
        super('RestrictedSortingScene');
    }

    init(data): void {

        // Data from scene before
        this.jsonObject = data.jsonObject;
        this.level = data.setLevel;

        this.objZoneMap = [];
        this.zoneObjMap = [];

        this.displayedObjects = [];

        this.dropZone1 = this.add.group();
        this.dropZone2 = this.add.group();
        this.dropZone3 = this.add.group();

        this.objectSize = 100;
    }

    preload(): void {
        // TODO: Load UI
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('crate', 'assets/ui/crate_topview.png');

        // TODO: Preselect objects
        if (this.level === 1) {
            // ???
        } else {
            const categories: any[] = [...this.jsonObject['categories']];
            const rndCat = Phaser.Math.RND.shuffle(categories)[0];
            for (let property of Phaser.Math.RND.shuffle(rndCat['validElements']).slice(0, 3)) {

                let maxSize: number = 2;
                if (this.objectSize === 2) {
                    maxSize = 6;
                } else if (this.objectSize === 6) {
                    maxSize = 12;
                }

                for (let image of Phaser.Math.RND.shuffle(this.jsonObject['images'])) {
                    if (this.displayedObjects.length >= maxSize) {
                        break;
                    }
                    console.log(image[rndCat.name]);
                    console.log(property.name);
                    if (image[rndCat.name] === property.name) {
                        this.load.image(image.name, 'assets/images/' + image.name);
                        this.displayedObjects.push(image);
                    }
                }
            }
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

        this.setBackground();

        this.setDropZones();

        this.setObjects();

        // TODO: Display objects
        // TODO: Action on objects, drag and drop
        // TODO: Display dropzones
        // TODO: Action on dropzones, placement free + scaling accordingly, check if all objects are placed or simultaniously? how to display failure? rot markieren mit reset button und check button?
        // TODO: level 1 choose one category, level two categories can be mixed
        // TODO: placement in containers 6 4 2? absrpache mit elizabeta
    }

    update(time: number): void {

    }

    private setBackground() {
        let background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);
    }

    private setDropZones() {
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
            zone.setOrigin(0, 0);
            zone.setName("zone1");
            this.dropZone1.add(zone);
            this.zoneObjMap.push(zone);

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
            zone.setOrigin(0, 0);
            zone.setName("zone2");

            this.dropZone2.add(zone);
            this.zoneObjMap.push(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }

        for (let i: number = 0; i < 2; i++) {
            let x = crate3.x - crate3.width*scale/2;
            let y = crate3.y - crate3.height*scale/2;
            let zone = this.add.zone(x+(i%2)*crate3.width*scale/2, y, crate3.width*scale/2, crate3.height*scale);
            zone.setRectangleDropZone(crate3.width*scale/2, crate3.height*scale);
            zone.setOrigin(0, 0);
            zone.setName("zone3");

            this.dropZone3.add(zone);
            this.zoneObjMap.push(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }
        this.input.on('dragstart', function(pointer, gameObject) {
            this.children.bringToTop(gameObject);

            let index = this.objZoneMap.indexOf(gameObject);
            if (index > -1) {
                delete this.objZoneMap[index];
            }

            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.clearTint();
                gameObject.setTintFill(0xf0000f);
            }
        }, this);

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped && gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.clearTint();
                gameObject.setTintFill(0xf00f0f);
            }
        }, this);

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if (gameObject instanceof Phaser.GameObjects.Sprite){
                gameObject.setPosition(dragX, dragY);
            }
        }, this);

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            if (gameObject instanceof Phaser.GameObjects.Sprite && dropZone instanceof Phaser.GameObjects.Zone) {
                let index = this.zoneObjMap.indexOf(dropZone);

                if (typeof this.objZoneMap[index] == 'undefined'){
                    gameObject.clearTint();
                    gameObject.setTintFill(0x0000ff);
                    let imageScale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height)*0.9, gameObject.width, gameObject.height);
                    gameObject.setScale(imageScale, imageScale);
                    gameObject.setPosition(dropZone.getCenter().x, dropZone.getCenter().y);

                    this.objZoneMap[index] = gameObject;
                } else {
                    gameObject.clearTint();
                    gameObject.setTintFill(0xffffff);
                    gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
                }


            }
        }, this);
    }

    private setObjects() {
        for (let image of this.displayedObjects) {
            const x = Phaser.Math.RND.between(100 + this.objectSize / 2, this.cameras.main.width - this.objectSize / 2);
            const y = Phaser.Math.RND.between(this.objectSize / 2, this.cameras.main.height / 2 - this.objectSize / 2);
            let sprite = this.add.sprite(x, y, image.name);
            const scale = this.imageScalingFactor(this.objectSize, sprite.width, sprite.height);
            sprite.setScale(scale, scale);
            sprite.setOrigin(0.5, 0.5);
            sprite.setInteractive();
            this.input.setDraggable(sprite);
            this.displayedObjects.add(sprite);
        }

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
    }
}

