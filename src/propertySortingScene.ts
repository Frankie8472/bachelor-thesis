import 'phaser';
import {BaseScene} from './BaseScene';

export class PropertySortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    /**
     * Array index number +1 of category to sort
     */
    private setCat: number;

    /**
     * Should the object fall (true) or be static (false)
     */
    private infinite: boolean;

    /**
     * All loaded objects
     */
    private arrayStack: Phaser.GameObjects.Container;

    /**
     * All displayed interactive objects with NO velocity
     */
    private arrayStatic: Phaser.GameObjects.Group;

    /**
     * All displayed interactive objects WITH velocity
     */
    private arrayFalling: Phaser.GameObjects.Group;

    /**
     * All DROPPED displayed interactive objects
     */
    private arrayDropped: Phaser.GameObjects.Group;

    /**
     * All category objects (images)
     */
    private arrayCategory: Phaser.GameObjects.Group;

    /**
     * All drop zones
     */
    private arrayDropZone: Phaser.GameObjects.Group;

    /**
     * Display size of displayed interactive objects
     */
    private objectDisplaySize: number;

    /**
     * Object of the number of correct categorized objects
     */
    private correctBar: Phaser.GameObjects.Sprite;

    /**
     * Object of the number of incorrect categorized objects
     */
    private wrongBar: Phaser.GameObjects.Sprite;

    /**
     * Number of correct categorized objects
     */
    private correctCount: number;

    /**
     * Number of incorrect categorized objects
     */
    private wrongCount: number;

    /**
     * Amount of properties in the respective category
     */
    private propertyCount: number;

    /**
     * Maximum reachable points
     */
    private maxPoints: number;

    /**
     * Object falling speed
     */
    private velocity: number;

    /**
     * Last time an object was emitted to fall
     */
    private lastEmitTime: number;

    /**
     * Time until the next object starts to fall
     */
    private delay: number;

    /**
     * How many objects of each category - category count
     */
    private numberOfObjectsEach: number;

    /**
     * Array of preselected objects for faster loading
     */
    private selectedElements: string[];

    constructor() {
        super('PropertySortingScene');
    }

    init(data): void {

        // Initialize data from previous scene
        this.jsonObject = data.jsonObject;
        this.infinite = data.infinite;
        this.setCat = data.setCat;

        // Initialize fields
        this.arrayStack = this.add.container(0, 0);
        this.arrayCategory = this.add.group();
        this.arrayStatic = this.add.group();
        this.arrayFalling = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayDropZone = this.add.group();

        let numberOfProperties = 0;
        for (let property of this.jsonObject['categories'][this.setCat - 1].validElements) {
            numberOfProperties++;
        }

        this.correctCount = 0;
        this.wrongCount = 0;

        this.selectedElements = [];

        // Randomization of amount of properties to sort
        this.propertyCount = Phaser.Math.RND.between(3, numberOfProperties);

        // Debatable initializations
        this.objectDisplaySize = 100;
        this.velocity = 150;
        this.lastEmitTime = 0;
        this.delay = 2000;
        this.numberOfObjectsEach = 3;
    }

    preload(): void {

        // Preload UI
        this.load.image('gamebackground', 'assets/ui/sorting_background.png');
        this.load.image('wooden_crate', 'assets/ui/wooden_crate.png');

        // Preselect properties
        for (let property of this.jsonObject['categories'][this.setCat - 1].validElements) {
            this.selectedElements.push(property.name);
        }

        // Pick the elements
        while (this.selectedElements.length > this.propertyCount) {
            this.selectedElements = Phaser.Math.RND.shuffle(this.selectedElements);
            this.selectedElements.pop();
        }

        // Get property images
        for (let prop of this.jsonObject['categories'][this.setCat - 1].validElements) {
            if (prop.url === null || !(this.selectedElements.indexOf(prop.name) > -1)) {
                continue;
            }

            let name = prop.name;
            let path = 'assets/geometrical_objects/images/' + prop.url;
            this.load.image(name, path);
        }

        // Preload progressbar images
        this.load.image('progressbar', 'assets/ui/progressbar.png');
        this.load.image('progressbarGreen', 'assets/ui/progressbar_green.png');
        this.load.image('progressbarRed', 'assets/ui/progressbar_red.png');
        this.load.image('plus', 'assets/ui/plus.png');
        this.load.image('minus', 'assets/ui/minus.png');
    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.key);
        this.transitionIn();

        this.setBackground();
        this.addProgressbar();
        this.loadObjects();
        this.setDropzones();
        this.initInput();
        this.initFirstDrop();
    }

    update(time: number): void {
        // If infinite, emit object after a specified amount of time
        if (this.infinite) {
            let diff: number = time - this.lastEmitTime;
            if (diff > this.delay) {
                this.lastEmitTime = time;
                if (this.delay > 500) {
                    this.delay -= 20;
                }
                if (this.arrayStatic.getLength() != 0) {
                    const sprite: Phaser.Physics.Arcade.Sprite = Phaser.Math.RND.pick(this.arrayStatic.getChildren());
                    this.arrayStatic.remove(sprite);
                    sprite.setVelocityY(this.velocity);

                }
            }
        }
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
     * Functions for initializing the drop zones
     */
    private setDropzones(): void {
        const stepSize: number = this.cameras.main.width / (this.propertyCount + 1);
        const crateSize: number = this.objectDisplaySize * 2;
        let iteration: number = 1;

        for (let property of this.selectedElements) {
            // Add crate
            const crate: Phaser.GameObjects.Sprite = this.add.sprite(stepSize * iteration, this.cameras.main.height - crateSize / 2, 'wooden_crate');
            crate.setOrigin(0.5, 0.5);

            const imageScalingFactor: number = this.imageScalingFactor(crateSize, crate.width, crate.height);
            crate.setScale(imageScalingFactor, imageScalingFactor);

            // Add zone around crate
            const zone: Phaser.GameObjects.Zone = this.add.zone(crate.x, crate.y, crate.width * imageScalingFactor, crate.height * imageScalingFactor);
            zone.setOrigin(0.5, 0.5);
            zone.setRectangleDropZone(crate.width * imageScalingFactor, crate.height * imageScalingFactor);
            zone.setName(property);

            this.arrayDropZone.add(zone);

            iteration++;
        }
    }

    /**
     * Function which initializes all input actions
     */
    private initInput() {

        // On dragstart
        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject.setTint(0x999999);
                gameObject.setVelocityY(0);
                const zoomSpriteScale: number = gameObject.getData('scale') * 1.5;
                gameObject.setScale(zoomSpriteScale, zoomSpriteScale);
                this.arrayStack.bringToTop(gameObject);
            }
        }, this);

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if (gameObject instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject.setPosition(dragX, dragY);
            }
        }, this);

        // On stop dragging
        this.input.on('dragend', function(pointer, gameObject, dropped) {
            // If not dropped set default visual effects
            if (!dropped && gameObject instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject.clearTint();

                let scale: number = gameObject.getData('scale');
                gameObject.setScale(scale, scale);

                if (this.infinite) {
                    gameObject.setVelocityY(this.velocity);
                }

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

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            if (gameObject instanceof Phaser.Physics.Arcade.Sprite && dropZone instanceof Phaser.GameObjects.Zone) {
                let coords: number[] = [gameObject.input.dragStartX, gameObject.input.dragStartY];
                let scale: number = gameObject.getData('scale');
                let point: number = -1;

                if (gameObject.name === dropZone.name) {
                    coords = [dropZone.x + dropZone.width * 0.15, dropZone.y - dropZone.height * 0.2];

                    scale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height) * 0.4, gameObject.width, gameObject.height);

                    this.arrayDropped.add(gameObject);

                    gameObject.disableInteractive();
                    gameObject.setImmovable(true);

                    point = +1;

                } else {
                    if (this.infinite) {
                        gameObject.setVelocityY(this.velocity);
                    }
                }

                this.updateProgressbar(point);
                gameObject.clearTint();
                gameObject.setScale(scale, scale);
                gameObject.setPosition(coords[0], coords[1]);
            }
        }, this);
    }

    /**
     * function for initializing all game objects
     */
    private loadObjects(): void {
        this.arrayStack.setDepth(1);

        for (let propImageName of this.selectedElements) {

            // Create 10 of each property
            for (let i = 0; i < this.numberOfObjectsEach; i++) {
                // RND size
                const size: number = Phaser.Math.RND.between(this.objectDisplaySize * 0.8, this.objectDisplaySize * 1.3);

                const sprite: Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(Phaser.Math.RND.between(100 + this.objectDisplaySize / 2, this.cameras.main.width - this.objectDisplaySize / 2), Phaser.Math.RND.between(this.objectDisplaySize / 2, this.cameras.main.height - this.objectDisplaySize * 2 - this.objectDisplaySize / 2), propImageName);
                sprite.setName(propImageName);

                if (this.infinite) {
                    sprite.setY(0 - 2 * this.objectDisplaySize);
                }

                sprite.setVelocity(0, 0);
                sprite.setOrigin(0.5, 0.5);

                // RND spin
                sprite.setAngle(Phaser.Math.RND.angle());

                sprite.setVisible(true);

                const spriteScale: number = this.imageScalingFactor(size, sprite.width, sprite.height);
                sprite.setScale(spriteScale, spriteScale);

                sprite.setData('scale', spriteScale);

                sprite.setInteractive();

                this.arrayStatic.add(sprite);
                this.arrayStack.add(sprite);

                this.input.setDraggable(sprite);
            }
        }

        this.maxPoints = this.arrayStack.length - this.propertyCount;

        const floor: Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(0, this.cameras.main.height + 2 * this.objectDisplaySize, 'background');
        floor.setDisplaySize(this.cameras.main.width, 1);
        floor.setTintFill(0x000000);
        floor.setOrigin(0, 0);
        floor.setImmovable(true);

        this.physics.add.collider(this.arrayStack.getAll(), floor, function(gameObject1) {
            this.updateProgressbar(-1);
            if (gameObject1 instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject1.setVelocityY(0);
                gameObject1.setPosition(Phaser.Math.RND.between(100 + this.objectDisplaySize / 2, this.cameras.main.width - this.objectDisplaySize / 2), 0 - 2 * this.objectDisplaySize);
                this.arrayStatic.add(gameObject1);
                this.arrayFalling.remove(gameObject1);
            }
        }, null, this);
    }

    /**
     * Function for visually marking the drop zones
     */
    private initFirstDrop(): void {
        let counterSet: string[] = [];

        for (let sprite of this.arrayStack.getAll()) {
            if (sprite instanceof Phaser.Physics.Arcade.Sprite) {
                const spriteName: string = sprite.name;
                if (!(counterSet.indexOf(spriteName) > -1)) {
                    for (let dropZone of this.arrayDropZone.getChildren()) {
                        if (dropZone instanceof Phaser.GameObjects.Zone) {
                            if (dropZone.name === spriteName) {
                                sprite.clearTint();
                                sprite.setPosition(dropZone.x + dropZone.width * 0.15, dropZone.y - dropZone.height * 0.2);

                                const imageScale: number = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height) * 0.4, sprite.width, sprite.height);
                                sprite.setScale(imageScale, imageScale);

                                this.arrayDropped.add(sprite);
                                sprite.disableInteractive();
                                this.arrayStatic.remove(sprite);

                                this.arrayStack.sendToBack(sprite);
                            }
                        }
                    }

                    counterSet.push(spriteName);
                }

                // Return if every crate has an example
                if (counterSet.length >= this.propertyCount) {
                    return;
                }
            }

        }
    }

    /**
     * Function for initializing the progressbar
     */
    private addProgressbar(): void {
        const multiplierX: number = 0.4;
        const multiplierY: number = 0.3;
        const progressbarY: number = this.cameras.main.height - 10;
        const progressbarCorrect: Phaser.GameObjects.Sprite = this.add.sprite(0, progressbarY, 'progressbar');
        progressbarCorrect.setOrigin(0, 1);
        progressbarCorrect.setScale(multiplierX, multiplierY);

        const progressbarCorrectX: number = 10 * 2 + progressbarCorrect.width * multiplierX;
        progressbarCorrect.setX(progressbarCorrectX);

        const progressbarWrong: Phaser.GameObjects.Sprite = this.add.sprite(10, progressbarY, 'progressbar');
        progressbarWrong.setOrigin(0, 1);
        progressbarWrong.setScale(multiplierX, multiplierY);

        const progressbarWrongX: number = 10; //10*2+progressbarWrong.width*multiplierX;
        progressbarWrong.setX(progressbarWrongX);

        const plus: Phaser.GameObjects.Sprite = this.add.sprite(progressbarCorrectX, progressbarY - progressbarWrong.height * multiplierY - 10, 'plus');
        const plusMultiplier: number = progressbarWrong.width * multiplierX / plus.width;
        plus.setOrigin(0, 1);
        plus.setScale(plusMultiplier, plusMultiplier);

        const minus: Phaser.GameObjects.Sprite = this.add.sprite(progressbarWrongX, progressbarY - progressbarWrong.height * multiplierY - 10, 'minus');
        const minusMultiplier: number = progressbarWrong.width * multiplierX / minus.width;
        minus.setOrigin(0, 1);
        minus.setScale(minusMultiplier, minusMultiplier);

        this.correctBar = this.add.sprite(progressbarCorrectX + progressbarCorrect.width * multiplierX / 2 + 2, progressbarY - 6, 'progressbarGreen');
        this.correctBar.setOrigin(0.5, 1);
        this.correctBar.setData('gameX', multiplierX);
        this.correctBar.setData('gameY', 0.01);
        this.correctBar.setData('gameMax', (progressbarCorrect.height * multiplierY - 6) / this.correctBar.height);
        this.correctBar.setScale(multiplierX, 0.01);
        this.correctBar.setAlpha(0.7);

        this.wrongBar = this.add.sprite(progressbarWrongX + progressbarWrong.width * multiplierX / 2 + 2, progressbarY - 6, 'progressbarRed');
        this.wrongBar.setOrigin(0.5, 1);
        this.wrongBar.setData('gameX', multiplierX);
        this.wrongBar.setData('gameY', 0.01);
        this.wrongBar.setData('gameMax', (progressbarWrong.height * multiplierY - 6) / this.wrongBar.height);
        this.wrongBar.setScale(multiplierX, 0.01);
        this.wrongBar.setAlpha(0.7);
    }

    /**
     * Function for updating the progressbar
     * @param point Number of points made (+1 or -1)
     */
    private updateProgressbar(point: number): void {

        if (point > 0) {
            // Add to plus: max number of cards minus three
            this.correctCount += this.correctBar.getData('gameMax') / this.maxPoints;
            this.correctBar.setScale(this.correctBar.getData('gameX'), this.correctCount);


        } else {
            // Add to minus: max not defined (lets say number of cards minus three also...)
            this.wrongCount += this.wrongBar.getData('gameMax') / this.maxPoints;
            this.wrongBar.setScale(this.wrongBar.getData('gameX'), this.wrongCount);

        }

        if ((this.wrongCount >= this.wrongBar.getData('gameMax') - Phaser.Math.EPSILON) || (this.correctCount >= this.correctBar.getData('gameMax') - Phaser.Math.EPSILON)) {
            this.transitionOut('ScoreScene', {
                'score': this.correctCount / this.correctBar.getData('gameMax') - this.wrongCount / this.wrongBar.getData('gameMax'),
                'previousScene': this.key
            });
        }
    }
}

