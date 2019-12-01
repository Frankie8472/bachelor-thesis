import 'phaser';
import {BaseScene} from './BaseScene';

export class SortingScene extends BaseScene {
    // Our Object with name, imagepath and properties
    private jsonObject: any;

    // Preselected chosen objects
    private selectedObjects: any[];

    // Remaining stack  of images
    private arrayStack: Phaser.GameObjects.Container;

    private arrayCategory: Phaser.GameObjects.Group;

    private cardDisplaySize: number;

    private objectsPerProperty: number;

    constructor() {
        super('SortingScene');
    }

    init(data): void {
        this.jsonObject = data.jsonObject;
        this.arrayStack = this.add.container(0, 0);
        this.arrayCategory = this.add.group();
        this.cardDisplaySize = 100;
        this.objectsPerProperty = 5;
    }

    preload(): void {
        this.load.image('gamebackground', 'assets/ui/sorting_background.png');

        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');

        //Object preselection
        this.imagePreSelection();

        // Get Image names from json and save them in array
        for (let image of this.selectedObjects) {
            let name: string = image.name;
            let path: string = 'assets/geometrical_objects/images/' + name;
            this.load.image(name, path);
        }

        // Get categories
        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }

            let name: string = cat.name;
            let path: string = 'assets/geometrical_objects/categories/' + cat.url;
            this.load.image(name, path);

        }
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

        // ================================================================================================
        // Add control bar
        // ================================================================================================

        this.controlBar();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadGameObjects();


    }

    update(time: number): void {
    }

    // ================================================================================================
    // Control Bar
    // ================================================================================================
    private controlBar(): void {
        let controlbar: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height, 'menubackground');
        controlbar.setOrigin(0.5, 0.5);
        controlbar.setAngle(-90);
        controlbar.setScale(0.13, 0.24);

        // Category indicator
        let x: number = this.cameras.main.width / 2 - (controlbar.height * 0.24) / 2;
        let countCategories: number = 0;

        // Find out how many categories not null exist
        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }
            countCategories++;
        }

        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }

            let validElements: any[] = cat['validElements'];
            validElements.forEach((object, index, array) => array[index] = object.name);

            x += (controlbar.height * 0.24) / (countCategories + 1);
            const name: string = cat.name;
            const sprite: Phaser.GameObjects.Sprite = this.add.sprite(x, this.cameras.main.height - controlbar.width * 0.13 / 5, name);
            sprite.setName(name);

            sprite.setData('pushed', false);
            sprite.setData('validElements', validElements);

            sprite.setOrigin(0.5, 0.5);
            const scale: number = this.imageScalingFactor(64, sprite.width, sprite.height);
            sprite.setScale(scale, scale);
            sprite.setVisible(true);

            this.arrayCategory.add(sprite);

            sprite.setInteractive();

            sprite.on('pointerdown', function(event) {
                for (let item of this.arrayCategory.getChildren()) {
                    if (item instanceof Phaser.GameObjects.Sprite) {
                        item.clearTint();
                    }
                }

                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.setTintFill(0x8dfd59);
                    this.orderObjects(sprite.name, sprite.getData('validElements'));
                }
            }, this);
        }
    }

    // ================================================================================================
    // Card action
    // ================================================================================================
    private loadGameObjects(): void {
        this.arrayStack.setDepth(2);

        for (let image of this.selectedObjects) {
            let size = this.cardDisplaySize;

            const name = image.name;
            const cat1 = image.cat1;
            const cat2 = image.cat2;
            const cat3 = image.cat3;
            const cat4 = image.cat4;

            const sprite: Phaser.GameObjects.Sprite = this.add.sprite(Phaser.Math.RND.between(100 + size / 2, this.cameras.main.width - size / 2), Phaser.Math.RND.between(size / 2, this.cameras.main.height - 100 - size / 2), name);

            this.arrayStack.add(sprite);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            sprite.setVisible(true);

            const scale: number = Math.min(size / sprite.height, size / sprite.width);
            sprite.setScale(scale, scale);
            sprite.setInteractive();

            this.input.setDraggable(sprite);
            this.input.enableDebug(sprite);

            this.input.on('drag', function(pointer, obj, dragX, dragY) {
                obj.setPosition(dragX, dragY);
            });

            sprite.on('pointerdown', function(event) {
                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.setTint(0x999999);
                    this.arrayStack.bringToTop(sprite);
                }
            }, this);

            sprite.on('pointerup', function(event) {
                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.clearTint();
                }
            }, this);
        }
    }

    private orderObjects(categoryName: string, validElements: string[]): void {
        this.arrayStack.each(function(element) {
            if (element instanceof Phaser.GameObjects.Sprite) {
                let coords: number[] = this.returnQuad(validElements.indexOf(element.getData(categoryName)), validElements.length, this.cardDisplaySize);
                element.setX(coords[0]);
                element.setY(coords[1]);
            }
        }, this);
    }

    private imagePreSelection(): void {
        // Select an manageable amount of images to be displayed
        let selectiveArray: any[] = [];
        let originArray: any[] = this.jsonObject['images'];
        // Select category to add
        for (let category of this.jsonObject['categories']) {
            let temporaryArray: any[] = [];

            // Select property to add
            for (let property of category['validElements']) {
                originArray = Phaser.Math.RND.shuffle(originArray);

                // Check how many are needed in already selected elements
                let missing: number = this.objectsPerProperty;

                for (let selectedImage of selectiveArray) {
                    if (missing <= 0) {
                        break;
                    }

                    if (selectedImage[category.name] === property.name) {
                        missing--;
                    }
                }

                // Add number of needed images per property
                for (let image of originArray) {
                    if (missing <= 0) {
                        break;
                    }

                    if (image[category.name] === property.name) {
                        temporaryArray.push(image);
                        missing--;
                    }
                }

                for (let image of temporaryArray) {
                    const index = originArray.indexOf(image, 0);
                    if (index > -1) {
                        originArray.splice(index, 1);
                    }
                }
            }
            // Da concat auf leeren listen nicht zu funktionieren schein, machen wir ein bischen lambda magic
            temporaryArray.forEach((x) => selectiveArray.push(x));
        }
        this.selectedObjects = selectiveArray;
    }
}
