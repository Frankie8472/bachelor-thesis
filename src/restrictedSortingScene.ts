import 'phaser';
import {BaseScene} from './BaseScene';

export class RestrictedSortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    /**
     * Difficulty level
     */
    private level: number;

    /**
     * Global average display size of interactive objects
     */
    private objectSize: number;

    /**
     * Two arrays which map the dropped objects to the respective zone and vice versa
     */
    private zoneObjMap: Phaser.GameObjects.Zone[];
    private objZoneMap: Phaser.GameObjects.Sprite[];

    /**
     * Array of preselcted objects so that not all objects must be loaded
     */
    private preselectedObjects: any[];

    /**
     * Array of all displayed and not dropped objects
     */
    private displayedObjects: Phaser.GameObjects.Group;

    constructor() {
        super('RestrictedSortingScene');
    }

    init(data): void {

        // Initialize data from previous scene
        this.jsonObject = data.jsonObject;
        this.level = data.setLevel;

        // Initialize fields
        this.objZoneMap = [];
        this.zoneObjMap = [];
        this.preselectedObjects = [];
        this.displayedObjects = this.add.group();
        this.objectSize = 100;
    }

    preload(): void {
        // Preload background and ui images
        if (this.textures.exists('gamebackground')){
            this.textures.remove('gamebackground')
        }
        this.load.image('gamebackground', 'assets/ui/background2.png');
        this.load.image('crate', 'assets/ui/crate_topview.png');

        // Load accordingly to level
        if (this.level === 1) {

            // Copy category array
            const categories: any[] = [...this.jsonObject['categories']];

            // Choose a random category
            const rndCat: any = Phaser.Math.RND.shuffle(categories)[0];

            // Select random fitting images
            const images: any[] = [...this.jsonObject['images']];
            Phaser.Math.RND.shuffle(images);

            for (let property of Phaser.Math.RND.shuffle(rndCat['validElements']).slice(0, 3)) {

                // Choose for one category 2, for the other 4 and for the last 6 matching (in one property) images.
                let maxSize: number = 2;
                if (this.preselectedObjects.length === 2) {
                    maxSize = 6;
                } else if (this.preselectedObjects.length === 6) {
                    maxSize = 12;
                }

                // Iterate through the images until selecting criteria is fulfilled
                for (let image of images) {
                    // If selected enough images, break.
                    if (this.preselectedObjects.length >= maxSize) {
                        break;
                    }

                    // Load and add image if is has the same property as the selected one
                    if (image[rndCat.name] === property.name) {
                        this.load.image(image.name, 'assets/geometrical_objects/images/' + image.name);
                        this.preselectedObjects.push(image);
                    }
                }

                // Remove the selected images from the images array to avoid duplicates
                this.preselectedObjects.forEach(function (element) {
                    if (images.indexOf(element, 0) > -1) {
                        images.splice(images.indexOf(element, 0), 1);
                    }
                }, this);
            }
        } else {

            // Copy category array
            const categories: any[] = [...this.jsonObject['categories']];

            // Choose a random category
            const rndCat: any = Phaser.Math.RND.shuffle(categories)[0];

            // Select random fitting images
            const images: any[] = [...this.jsonObject['images']];
            Phaser.Math.RND.shuffle(images);

            for (let property of Phaser.Math.RND.shuffle(rndCat['validElements']).slice(0, 3)) {

                // Choose for one category 2, for the other 4 and for the last 6 matching (in one property) images.
                let maxSize: number = 5;
                if (this.preselectedObjects.length === 5) {
                    maxSize = 9;
                } else if (this.preselectedObjects.length === 9) {
                    maxSize = 15;
                }

                // Iterate through the images until selecting criteria is fulfilled
                for (let image of images) {
                    // If selected enough images, break.
                    if (this.preselectedObjects.length >= maxSize) {
                        break;
                    }

                    // Load and add image if is has the same property as the selected one
                    if (image[rndCat.name] === property.name) {
                        this.load.image(image.name, 'assets/geometrical_objects/images/' + image.name);
                        this.preselectedObjects.push(image);
                    }
                }

                // Remove the selected images from the images array to avoid duplicates
                this.preselectedObjects.forEach(function (element) {
                    if (images.indexOf(element, 0) > -1) {
                        images.splice(images.indexOf(element, 0), 1);
                    }
                }, this);
            }
        }

        if (this.textures.exists('loading')){
            this.textures.remove('loading')
        }
        this.load.audio('loading', 'assets/ui_audio/loading.mp3');
    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.transitionIn();

        this.setBackground();
        this.setDropZones();
        this.setObjects();
        this.initInput();
        this.initAudio();
    }

    update(time: number): void {

    }

    /**
     * Function which initializes the background graphics
     */
    private setBackground() {
        let background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);
    }

    /**
     * Function which initializes the dropZones and their graphics
     */
    private setDropZones() {
        let crate1: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width*(1/6), this.cameras.main.height*(3/4),'crate');
        let crate2: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width*(3/6), this.cameras.main.height*(3/4),'crate');
        let crate3: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width*(5/6), this.cameras.main.height*(3/4),'crate');

        crate1.setOrigin(0.5, 0.5);
        crate2.setOrigin(0.5, 0.5);
        crate3.setOrigin(0.5, 0.5);

        let scale: number = this.imageScalingFactor(Math.min(this.cameras.main.width/3, this.cameras.main.height/2) - 40, crate1.width, crate1.height);
        crate1.setScale(scale, scale);
        crate2.setScale(scale, scale);
        crate3.setScale(scale, scale);

        for (let i: number = 0; i < 6; i++) {
            let heightPosition: number = 0;
            if (i > 2) {
                heightPosition = 1;
            }

            let x: number = crate1.x - crate1.width*scale/2;
            let y: number = crate1.y - crate1.height*scale/2;
            let zone: Phaser.GameObjects.Zone = this.add.zone(x+(i%3)*crate1.width*scale/3, y+heightPosition*crate1.height*scale/2, crate1.width*scale/3, crate1.height*scale/2);
            zone.setRectangleDropZone(crate1.width*scale/3, crate1.height*scale/2);
            zone.setOrigin(0, 0);
            zone.setName("dropZone1");
            this.zoneObjMap.push(zone);

            // Display border of drop zones
            let graphics: Phaser.GameObjects.Graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);

        }

        for (let i: number = 0; i < 4; i++) {
            let heightPosition: number = 0;
            if (i > 1) {
                heightPosition = 1;
            }

            let x: number = crate2.x - crate2.width*scale/2;
            let y: number = crate2.y - crate2.height*scale/2;
            let zone: Phaser.GameObjects.Zone = this.add.zone(x+(i%2)*crate2.width*scale/2, y+heightPosition*crate2.height*scale/2, crate2.width*scale/2, crate2.height*scale/2);
            zone.setRectangleDropZone(crate2.width*scale/2, crate2.height*scale/2);
            zone.setOrigin(0, 0);
            zone.setName("dropZone2");

            this.zoneObjMap.push(zone);

            // Display border of drop zones
            let graphics: Phaser.GameObjects.Graphics = this.add.graphics();
            graphics.lineStyle(10, 0x000000);
            graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }

        if (this.level == 1) {
            for (let i: number = 0; i < 2; i++) {
                let x: number = crate3.x - crate3.width*scale/2;
                let y: number = crate3.y - crate3.height*scale/2;
                let zone: Phaser.GameObjects.Zone = this.add.zone(x+(i%2)*crate3.width*scale/2, y, crate3.width*scale/2, crate3.height*scale);
                zone.setRectangleDropZone(crate3.width*scale/2, crate3.height*scale);
                zone.setOrigin(0, 0);
                zone.setName("dropZone3");

                this.zoneObjMap.push(zone);

                // Display border of drop zones
                let graphics: Phaser.GameObjects.Graphics = this.add.graphics();
                graphics.lineStyle(10, 0x000000);
                graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
            }
        } else {
            for (let i: number = 0; i < 5; i++) {
                let mod: number = 3;
                let heightPosition: number = 0;
                if (i > 2) {
                    heightPosition = 1;
                    mod = 2;
                }
                let x: number = crate3.x - crate3.width*scale/2;
                let y: number = crate3.y - crate3.height*scale/2;
                let zone: Phaser.GameObjects.Zone = this.add.zone(x+(i%mod)*crate3.width*scale/mod, y+heightPosition*crate3.height*scale/2, crate3.width*scale/mod, crate3.height*scale/2);
                zone.setRectangleDropZone(crate3.width*scale/mod, crate3.height*scale/2);
                zone.setOrigin(0, 0);
                zone.setName("dropZone3");

                this.zoneObjMap.push(zone);

                // Display border of drop zones
                let graphics: Phaser.GameObjects.Graphics = this.add.graphics();
                graphics.lineStyle(10, 0x000000);
                graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
            }
        }

    }

    /**
     * Function which initializes all input actions
     */
    private initInput(): void {
        // On start dragging
        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                // Bring gameObject to top
                this.children.bringToTop(gameObject);

                // Set visual effects
                gameObject.clearTint();
                gameObject.setTint(0x999999);

                let scale: number = gameObject.getData('scale')*1.2;
                gameObject.setScale(scale, scale);
            }
        }, this);

        // On stop dragging
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            // If not dropped set default visual effects
            if (!dropped && gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.clearTint();

                let scale: number = gameObject.getData('scale');
                gameObject.setScale(scale, scale);

                let x: number = gameObject.x;
                let y: number = gameObject.y;
                let dist: number = Math.sqrt(Math.pow(gameObject.width*gameObject.getData('scale'), 2) + Math.pow(gameObject.height*gameObject.getData('scale'), 2))/2;

                if (x < 0) {
                    x = 0 + dist;
                }

                if (y < 0) {
                    y = 0 + dist;
                }

                if (x > this.cameras.main.width) {
                    x = this.cameras.main.width - dist;
                }

                if (y > this.cameras.main.height) {
                    y = this.cameras.main.height - dist;
                }

                gameObject.setPosition(x, y);

                // Check if the gameObject is already in a zone
                let index = this.objZoneMap.indexOf(gameObject);
                if (index > -1) {
                    // Clear gameObject from this zone
                    delete this.objZoneMap[index];
                    this.displayedObjects.add(gameObject);
                }
            }
        }, this);

        // While dragging update coordinates
        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if (gameObject instanceof Phaser.GameObjects.Sprite){
                gameObject.setPosition(dragX, dragY);
            }
        }, this);

        // On drop
        this.input.on('drop', function(pointer, gameObject, dropZone) {
            if (gameObject instanceof Phaser.GameObjects.Sprite && dropZone instanceof Phaser.GameObjects.Zone) {
                let scale: number = gameObject.getData('scale');
                let coords: number[] = [gameObject.input.dragStartX, gameObject.input.dragStartY];

                // Check if there is already an object in the dropZone and if the current gameObject fits with the other elements
                let index1: number = this.zoneObjMap.indexOf(dropZone);
                let index2:number = this.objZoneMap.indexOf(gameObject);
                if (typeof this.objZoneMap[index1] == 'undefined' && this.equalityCheck(gameObject, dropZone)){
                    // Check if the gameObject is already in a zone
                    if (index2 > -1) {
                        // Clear gameObject from this zone
                        delete this.objZoneMap[index2];
                        this.displayedObjects.add(gameObject);
                    }

                    // Set scale and coordinates
                    scale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height)*0.9, gameObject.width, gameObject.height);
                    coords = [dropZone.getCenter().x, dropZone.getCenter().y];

                    // Add object to the dropZone
                    this.objZoneMap[index1] = gameObject;

                    // Remove from displayed array
                    this.displayedObjects.remove(gameObject);

                    // If all elements are sorted, end game with score
                    if (this.displayedObjects.getLength() <= 0) {
                        this.transitionOut('ScoreScene', {'score': 1, 'previousScene': this.getKey()});
                    }


                } else if (index2 > -1) {
                    // Check if the gameObject was already in a zone
                    let dropZoneOld: Phaser.GameObjects.Zone = this.zoneObjMap[index2];
                    scale = this.imageScalingFactor(Math.min(dropZoneOld.width, dropZoneOld.height)*0.9, gameObject.width, gameObject.height);
                }

                // Set default visual effect and position
                gameObject.clearTint();
                gameObject.setScale(scale, scale);
                gameObject.setPosition(coords[0], coords[1]);
            }
        }, this);
    }

    /**
     * Function which initializes all the displayed object to sort
     */
    private setObjects() {
        for (let image of this.preselectedObjects) {
            const x = Phaser.Math.RND.between(100 + this.objectSize / 2, this.cameras.main.width - this.objectSize / 2);
            const y = Phaser.Math.RND.between(this.objectSize / 2, this.cameras.main.height / 2 - this.objectSize / 2);

            let sprite = this.add.sprite(x, y, image.name);

            const size: number = Phaser.Math.RND.between(this.objectSize, this.objectSize*1.3);
            const scale = this.imageScalingFactor(size, sprite.width, sprite.height);

            sprite.setScale(scale, scale);
            sprite.setOrigin(0.5, 0.5);
            sprite.setVisible(true);

            sprite.setName(image.name);
            sprite.setData('scale', scale);
            sprite.setData('properties', [image.cat1, image.cat2, image.cat3, image.cat4]);

            sprite.setInteractive({ cursor: 'pointer' });
            this.input.setDraggable(sprite);

            this.displayedObjects.add(sprite);
        }
    }

    /**
     * Function for checking if there are mutual properties between the elements in the dropZone and the gameObject
     * @param gameObject Current object you want to add to the dropZone
     * @param dropZone Current dropZone the gameObject should be added to
     */
    private equalityCheck(gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone): boolean {
        // Initialize property-intersect-array
        let mergeArray: any[] = [];

        // Fill array with all property names
        for (let cat of this.jsonObject['categories']) {
            mergeArray = [...mergeArray, ...cat['validElements']];
        }
        mergeArray.forEach((element, index, array) => array[index] = element.name);

        // Intersect valid elements of all elements already in dropzone plus current gameObject
        [...this.objZoneMap.filter((element, index) => this.zoneObjMap[index].name === dropZone.name), gameObject].forEach(function(element){
            mergeArray = mergeArray.filter((x) => element.getData('properties').includes(x));
        });

        // Return false if there are no mutual properties
        return (mergeArray.length > 0);
    }

    /**
     * Function for initializing soundeffects
     */
    private initAudio() {
        this.sound.add('loading').play('', {loop: true});
    }
}

