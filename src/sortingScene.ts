import 'phaser';
import {BaseScene} from './BaseScene';

export class SortingScene extends BaseScene {
    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    /**
     * Preselected objects
     */
    private selectedObjects: any[];

    /**
     * Remaining stack of objects
     */
    private arrayStack: Phaser.GameObjects.Container;

    /**
     * All category objects
     */
    private arrayCategory: Phaser.GameObjects.Group;

    /**
     * Size of displayed objects
     */
    private objectDisplaySize: number;

    /**
     * Number of objects per property
     */
    private objectsPerProperty: number;

    /**
     * The size of buttons
     */
    private buttonSize: number;

    constructor() {
        super('SortingScene');
    }

    init(data): void {

        // Initialize data from previous scene
        this.jsonObject = data.jsonObject;

        // Initialize fields
        this.arrayStack = this.add.container(0, 0);
        this.arrayCategory = this.add.group();
        this.objectDisplaySize = 100;
        this.objectsPerProperty = 5;
        this.buttonSize = 64;
    }

    preload(): void {

        // Preload UI
        this.load.image('gamebackground', 'assets/ui/sorting_background.png');
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');
        this.load.image('exitbutton', 'assets/ui/exit_button.png');

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
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.key);
        this.transitionIn();

        this.setBackground();
        this.setControlBar();
        this.loadGameObjects();
        this.exitButton();
        this.initInput();
    }

    update(time: number): void {
    }

    /**
     * Function for pre-selecting a subgroup of images so that every property of each category has X representatives.
     */
    private imagePreSelection(): void {
        // Select an manageable amount of images to be displayed
        const selectiveArray: any[] = [];
        const originArray: any[] = [...this.jsonObject['images']];

        // Select category to add
        for (let category of this.jsonObject['categories']) {
            const temporaryArray: any[] = [];

            // Select property to add
            for (let property of category['validElements']) {
                Phaser.Math.RND.shuffle(originArray);
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

    /**
     * Function for initializing the background
     */
    private setBackground() {
        const background: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);
    }

    /**
     * Function for initializing the control bar
     */
    private setControlBar(): void {
        const controlbar: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height, 'menubackground');
        controlbar.setOrigin(0.5, 0.5);
        controlbar.setAngle(-90);
        controlbar.setScale(0.13, 0.20);

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

            const validElements: any[] = [...cat['validElements']];
            validElements.forEach((object, index, array) => array[index] = object.name);

            x += (controlbar.height * 0.24) / (countCategories + 1);
            const name: string = cat.name;
            const sprite: Phaser.GameObjects.Sprite = this.add.sprite(x, this.cameras.main.height - controlbar.width * 0.13 / 5, name);
            sprite.setName(name);
            sprite.setOrigin(0.5, 0.5);

            sprite.setData('validElements', validElements);

            const scale: number = this.imageScalingFactor(this.buttonSize, sprite.width, sprite.height);
            sprite.setScale(scale, scale);

            sprite.setVisible(true);

            this.arrayCategory.add(sprite);

            sprite.setInteractive();

            sprite.on('pointerdown', function() {
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

    /**
     * Function for loading all game objects
     */
    private loadGameObjects(): void {
        for (let image of this.selectedObjects) {

            let size = this.objectDisplaySize;

            const name = image.name;
            const cat1 = image.cat1;
            const cat2 = image.cat2;
            const cat3 = image.cat3;
            const cat4 = image.cat4;

            const sprite: Phaser.GameObjects.Sprite = this.add.sprite(Phaser.Math.RND.between(100 + size / 2, this.cameras.main.width - size / 2), Phaser.Math.RND.between(size / 2, this.cameras.main.height - 100 - size / 2), name);
            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());
            sprite.setVisible(true);

            const scale: number = Math.min(size / sprite.height, size / sprite.width);
            sprite.setScale(scale, scale);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);
            sprite.setData('scale', scale);

            sprite.setInteractive();

            this.arrayStack.add(sprite);
            this.arrayStack.bringToTop(sprite);

        }
        this.children.bringToTop(this.arrayStack);
    }

    /**
     * Function which initializes all global input actions
     */
    private initInput(): void {
        // On start dragging
        this.input.setDraggable(this.arrayStack.getAll());

        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                // Bring gameObject to top
                this.arrayStack.bringToTop(gameObject);

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
            }
        }, this);

        // While dragging update coordinates
        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if (gameObject instanceof Phaser.GameObjects.Sprite){
                gameObject.setPosition(dragX, dragY);
            }
        }, this);
    }

    /**
     * Function for adding the exit button
     */
    private exitButton() {
        const exitButton: Phaser.GameObjects.Sprite = this.add.sprite(10, this.cameras.main.height - 10, 'exitbutton');
        exitButton.setOrigin(0,1);
        exitButton.setInteractive();

        const scale: number = this.imageScalingFactor(this.buttonSize, exitButton.width, exitButton.height);
        exitButton.setScale(scale, scale);

        exitButton.on('pointerdown', function() {
            exitButton.on('pointerup', function() {
                this.transitionOut("LevelMenuScene");
            }, this);
        }, this);
    }

    /**
     * Function for ordering objects by the properties of a category in a grid
     * @param categoryName Name of the category
     * @param validElements Properties of this category
     */
    private orderObjects(categoryName: string, validElements: string[]): void {
        this.arrayStack.each(function(gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                let coords: number[] = this.returnQuad(validElements.indexOf(gameObject.getData(categoryName)), validElements.length, this.objectDisplaySize);
                gameObject.setPosition(coords[0], coords[1]);
            }
        }, this);
    }
}
