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

    private dropZone1Array: string[];
    private dropZone2Array: string[];
    private dropZone3Array: string[];


    private preselectedObjects: any[];
    private displayedObjects: Phaser.GameObjects.Group;

    constructor() {
        super('RestrictedSortingScene');
    }

    init(data): void {

        // Data from scene before
        this.jsonObject = data.jsonObject;
        this.level = data.setLevel;

        this.objZoneMap = [];
        this.zoneObjMap = [];

        this.preselectedObjects = [];

        this.dropZone1 = this.add.group();
        this.dropZone2 = this.add.group();
        this.dropZone3 = this.add.group();
        this.displayedObjects = this.add.group();

        this.objectSize = 100;
    }

    preload(): void {
        this.load.image('gamebackground', 'assets/ui/game_background.png');
        this.load.image('crate', 'assets/ui/crate_topview.png');

        if (this.level === 1) {
            // ???
        } else {
            const categories: any[] = [...this.jsonObject['categories']];
            const rndCat = Phaser.Math.RND.shuffle(categories)[0];
            let images: any[] = [...Phaser.Math.RND.shuffle(this.jsonObject['images'])];
            for (let property of Phaser.Math.RND.shuffle(rndCat['validElements']).slice(0, 3)) {

                let maxSize: number = 2;
                if (this.preselectedObjects.length === 2) {
                    maxSize = 6;
                } else if (this.preselectedObjects.length === 6) {
                    maxSize = 12;
                }

                for (let image of images) {
                    if (this.preselectedObjects.length >= maxSize) {
                        break;
                    }

                    if (image[rndCat.name] === property.name) {
                        this.load.image(image.name, 'assets/geometrical_objects/images/' + image.name);
                        this.preselectedObjects.push(image);
                    }
                }

                this.preselectedObjects.forEach(function (element) {
                    if (images.indexOf(element, 0) > -1) {
                        images.splice(images.indexOf(element, 0), 1);
                    }
                }, this);
            }
        }
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
                let index1 = this.dropZone1Array.indexOf(gameObject.name);
                if (index1 > -1) {
                    this.zoneObjMap.splice(index1, 1);
                }
                let index2 = this.dropZone1Array.indexOf(gameObject.name);
                if (index2 > -1) {
                    this.zoneObjMap.splice(index2, 1);
                }
                let index3 = this.dropZone1Array.indexOf(gameObject.name);
                if (index3 > -1) {
                    this.zoneObjMap.splice(index3, 1);
                }
            }

            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.clearTint();
                gameObject.setTint(0x999999);
            }
        }, this);

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped && gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.clearTint();
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

                if (typeof this.objZoneMap[index] == 'undefined' && this.equalityCheck(gameObject, dropZone)){
                    gameObject.clearTint();
                    let imageScale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height)*0.9, gameObject.width, gameObject.height);
                    gameObject.setScale(imageScale, imageScale);
                    gameObject.setPosition(dropZone.getCenter().x, dropZone.getCenter().y);

                    this.objZoneMap[index] = gameObject;
                } else {
                    gameObject.clearTint();
                    gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
                }


            }
        }, this);
    }

    private setObjects() {
        for (let image of this.preselectedObjects) {
            const x = Phaser.Math.RND.between(100 + this.objectSize / 2, this.cameras.main.width - this.objectSize / 2);
            const y = Phaser.Math.RND.between(this.objectSize / 2, this.cameras.main.height / 2 - this.objectSize / 2);
            let sprite = this.add.sprite(x, y, image.name);
            const scale = this.imageScalingFactor(this.objectSize, sprite.width, sprite.height);
            sprite.setScale(scale, scale);
            sprite.setOrigin(0.5, 0.5);
            sprite.setVisible(true);

            const name = image.name;
            const cat1 = image.cat1;
            const cat2 = image.cat2;
            const cat3 = image.cat3;
            const cat4 = image.cat4;

            sprite.setName(name);
            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);
            sprite.setData('properties', [cat1, cat2, cat3, cat4]);

            sprite.setInteractive();
            this.input.setDraggable(sprite);
            this.displayedObjects.add(sprite);
        }
    }

    private equalityCheck(gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone): boolean {
        let ret = true;
        let mergeArray: string[] = [];

        switch(dropZone.name) {
            case "dropZone1": {
                // TODO: Wrong iterate through all objects in dropzone
                this.objZoneMap.filter((element, index, array) => this.zoneObjMap[index].name === "dropZone1").forEach(function(element){
                    // TODO: dumm! mergearray kann 0 sein bei erneutem durchgehen der objekte.... idiot!!!! ändere!!!!
                    // de franz hets nöd so gmeint, du bisc okay. Kopf hoch! \(^o^)/

                    if (mergeArray.length <= 0){
                        mergeArray = element.getData('properties');
                    } else {
                        mergeArray = mergeArray.filter(x => element.getData('properties').includes(x));
                    }
                });
                if (mergeArray.length <= 0) {
                    ret = false;
                } else {
                    this.dropZone1Array.push(gameObject.name);
                }
                break;
            }
            case "dropZone2": {
                this.objZoneMap.filter((element, index, array) => this.zoneObjMap[index].name === "dropZone2").forEach(function(element){
                    if (mergeArray.length <= 0){
                        mergeArray = element.getData('properties');
                    } else {
                        mergeArray = mergeArray.filter(x => element.getData('properties').includes(x));
                    }
                });
                if (mergeArray.length <= 0) {
                    ret = false;
                } else {
                    this.dropZone2Array.push(gameObject.name);
                }
                break;
            }
            case "dropZone3": {
                this.objZoneMap.filter((element, index, array) => this.zoneObjMap[index].name === "dropZone3").forEach(function(element){
                    if (mergeArray.length <= 0){
                        mergeArray = element.getData('properties');
                    } else {
                        mergeArray = mergeArray.filter(x => element.getData('properties').includes(x));
                    }
                });
                if (mergeArray.length <= 0) {
                    ret = false;
                } else {
                    this.dropZone3Array.push(gameObject.name);
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

