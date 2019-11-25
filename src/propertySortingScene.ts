import 'phaser';
import {BaseScene} from './BaseScene';

export class PropertySortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;

    /**
     * Image groups and containers
     */
    // Container of all displayed interactive objects
    private arrayStack: Phaser.GameObjects.Container;

    // All displayed interactive objects with NO velocity
    private arrayStatic: Phaser.GameObjects.Group;

    // All displayed interactive objects WITH velocity
    private arrayFalling: Phaser.GameObjects.Group;

    // All DROPPED displayed interactive objects
    private arrayDropped: Phaser.GameObjects.Group;

    // All category objects (images)
    private arrayCategory: Phaser.GameObjects.Group;

    // All drop zones
    private arrayDropZone: Phaser.GameObjects.Group;

    // Display size of displayed interactive objects
    private cardDisplaySize: number;

    // Should the object fall (true) or be static (false)
    private infinite: boolean;

    // Image of the number of correct categorized objects
    private correctBar: Phaser.GameObjects.Sprite;

    // Image of the number of incorrect categorized objects
    private wrongBar: Phaser.GameObjects.Sprite;

    // Number of correct categorized objects
    private correctCount: number;

    // Number of incorrect categorized objects
    private wrongCount: number;

    // Array index Number +1 of category to sort
    private setCat: number;

    // Amount of properties in the respective category
    private propertyCount: number;

    // Maximum points to reach
    private maxPoints: number;

    // Object falling speed
    private velocity: number;

    // Last time an object was emitted to fall
    private lastEmitTime: number;

    // Time until the next object starts to fall
    private delay: number;

    // Lock for 'pointerup' and 'drop' so not both will get triggered. First 'drop' triggers, then 'pointerup' on 'drop'.
    private dropped: boolean;

    // How many objects of each category - category count
    private numberOfObjectsEach: number;

    private selectedElements: string[];

    constructor() {
        super('PropertySortingScene');
    }

    init(data): void {

        // Data from scene before
        this.jsonObject = data.jsonObject;
        this.infinite = data.infinite;
        this.setCat = data.setCat;

        // Normal initializations
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
        // Make it random
        // this.propertyCount = numberOfProperties;
        this.propertyCount = Phaser.Math.RND.between(3, numberOfProperties);

        this.correctCount = 0;
        this.wrongCount = 0;

        this.dropped = false;

        this.selectedElements = [];

        // Debatable initializations
        this.cardDisplaySize = 100;
        this.velocity = 150;
        this.lastEmitTime = 0;
        this.delay = 2000;
        this.numberOfObjectsEach = 3;
    }

    preload(): void {

        // Background
        this.load.image('gamebackground', 'assets/ui/sorting_background.png');

        // Wooden crate
        this.load.image('crate', 'assets/ui/wooden_crate.png');

        // Select properties
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

        // Add progressbar images
        this.load.image('progressbar', 'assets/ui/progressbar.png');
        this.load.image('progressbarGreen', 'assets/ui/progressbar_green.png');
        this.load.image('progressbarRed', 'assets/ui/progressbar_red.png');
        this.load.image('plus', 'assets/ui/plus.png');
        this.load.image('minus', 'assets/ui/minus.png');

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transitionIn();

        let background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);

        // ================================================================================================
        // Add progressbar
        // ================================================================================================

        this.addProgressbar();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();

        // ================================================================================================
        // Add crates
        // ================================================================================================

        this.initCrates();

        this.addCardToCrates();


    }

    update(time: number): void {
        if (this.infinite) {
            let diff: number = time - this.lastEmitTime;
            if (diff > this.delay) {
                this.lastEmitTime = time;
                if (this.delay > 500) {
                    this.delay -= 20;
                }
                if (this.arrayStatic.getLength() != 0) {
                    let sprite = Phaser.Math.RND.pick(this.arrayStatic.getChildren());
                    this.arrayStatic.remove(sprite);
                    sprite.setVelocityY(this.velocity);

                }
            }
        }
    }

    // ================================================================================================
    // Add Crates
    // ================================================================================================

    private initCrates(): void {
        // For each property add a crate
        // evenly distributed
        // make snap to grid over crate
        // add one element of each prop

        let stepSize = this.cameras.main.width / (this.propertyCount + 1);
        let crateSize = this.cardDisplaySize * 2;
        let iteration = 1;

        for (let property of this.selectedElements) {
            // Add crate
            let crate = this.add.sprite(stepSize * iteration, this.cameras.main.height - crateSize / 2, 'crate');
            crate.setOrigin(0.5, 0.5);

            let imageScalingFactor = this.imageScalingFactor(crateSize, crate.width, crate.height);
            crate.setScale(imageScalingFactor, imageScalingFactor);

            // Add zone around crate
            let zone = this.add.zone(crate.x, crate.y, crate.width * imageScalingFactor, crate.height * imageScalingFactor);
            zone.setOrigin(0.5, 0.5);
            zone.setRectangleDropZone(crate.width * imageScalingFactor, crate.height * imageScalingFactor);
            zone.setName(property);

            this.arrayDropZone.add(zone);

            iteration++;
        }

        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setData('x', gameObject.x);
                gameObject.setData('y', gameObject.y);
            }
        });

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.setPosition(dragX, dragY);
        });

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            this.dropped = true;
            if (gameObject instanceof Phaser.Physics.Arcade.Sprite) {
                if (gameObject.name === dropZone.name) {
                    gameObject.clearTint();
                    gameObject.x = dropZone.x + dropZone.width * 0.15;
                    gameObject.y = dropZone.y - dropZone.height * 0.2;
                    let imageScale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height) * 0.4, gameObject.width, gameObject.height);
                    gameObject.setScale(imageScale, imageScale);
                    this.arrayDropped.add(gameObject);
                    gameObject.disableInteractive();
                    gameObject.setImmovable(true);
                    this.updateProgressbar(+1);
                } else {
                    gameObject.x = gameObject.getData('x');
                    gameObject.y = gameObject.getData('y');
                    gameObject.setScale(gameObject.getData('originScale'), gameObject.getData('originScale'));
                    gameObject.clearTint();
                    if (this.infinite) {
                        gameObject.setVelocityY(this.velocity);
                    }
                    this.updateProgressbar(-1);
                }
            }
        }, this);

    }

    // ================================================================================================
    // Card action
    // ================================================================================================
    private loadCards(): void {
        this.arrayStack.setDepth(1);

        for (let propImageName of this.selectedElements) {

            // Create 10 of each property
            for (let i = 0; i < this.numberOfObjectsEach; i++) {
                // RND size
                let size = Phaser.Math.RND.between(this.cardDisplaySize * 0.8, this.cardDisplaySize * 1.3);

                let sprite = this.physics.add.sprite(Phaser.Math.RND.between(100 + this.cardDisplaySize / 2, this.cameras.main.width - this.cardDisplaySize / 2), Phaser.Math.RND.between(this.cardDisplaySize / 2, this.cameras.main.height - this.cardDisplaySize * 2 - this.cardDisplaySize / 2), propImageName);
                this.arrayStack.add(sprite);
                this.arrayStatic.add(sprite);
                sprite.setName(propImageName);

                let velocityY = 0;
                if (this.infinite) {
                    sprite.setY(0 - 2 * this.cardDisplaySize);
                }

                sprite.setVelocity(0, velocityY);
                sprite.setOrigin(0.5, 0.5);

                // RND spin
                sprite.setAngle(Phaser.Math.RND.angle());

                sprite.setVisible(true);

                let spriteScale = this.imageScalingFactor(size, sprite.width, sprite.height);
                sprite.setScale(spriteScale, spriteScale);

                sprite.setData('originScale', spriteScale);

                sprite.setInteractive();

                this.input.setDraggable(sprite);

                sprite.on('pointerdown', function(pointer, localX, localY, event) {
                    if (sprite instanceof Phaser.Physics.Arcade.Sprite) {
                        sprite.setTint(0x999999);
                        sprite.setVelocityY(0);
                        let zoomSpriteScale = this.imageScalingFactor(size * 1.5, sprite.width, sprite.height);
                        sprite.setScale(zoomSpriteScale, zoomSpriteScale);
                        this.arrayStack.bringToTop(sprite);
                    }
                }, this);

                sprite.on('pointerup', function(pointer, localX, localY, event) {
                    if (!this.dropped) {
                        sprite.setScale(sprite.getData('originScale'), sprite.getData('originScale'));
                        sprite.clearTint();
                        if (this.infinite) {
                            sprite.setVelocityY(this.velocity);
                        }
                    }
                    this.dropped = false;
                }, this);
            }
        }

        this.maxPoints = this.arrayStack.length - this.propertyCount;

        let floor = this.physics.add.sprite(0, this.cameras.main.height + 2 * this.cardDisplaySize, 'background');
        floor.setDisplaySize(this.cameras.main.width, 1);
        floor.setTintFill(0x000000);
        floor.setOrigin(0, 0);
        floor.setImmovable(true);

        this.physics.add.collider(this.arrayStack.getAll(), floor, function(gameObject1, gameObject2) {
            this.updateProgressbar(-1);
            if (gameObject1 instanceof Phaser.Physics.Arcade.Sprite) {
                gameObject1.setVelocityY(0);
                gameObject1.setPosition(Phaser.Math.RND.between(100 + this.cardDisplaySize / 2, this.cameras.main.width - this.cardDisplaySize / 2), 0 - 2 * this.cardDisplaySize);
                this.arrayStatic.add(gameObject1);
                this.arrayFalling.remove(gameObject1);
            }
        }, null, this);
    }

    private addCardToCrates(): void {
        let counterSet: string[] = [];

        for (let sprite of this.arrayStack.getAll()) {
            if (sprite instanceof Phaser.Physics.Arcade.Sprite) {
                let spriteName = sprite.name;
                if (!(counterSet.indexOf(spriteName) > -1)) {
                    for (let dropZone of this.arrayDropZone.getChildren()) {
                        if (dropZone instanceof Phaser.GameObjects.Zone) {
                            if (dropZone.name === spriteName) {
                                sprite.clearTint();
                                sprite.x = dropZone.x + dropZone.width * 0.15;
                                sprite.y = dropZone.y - dropZone.height * 0.2;
                                let imageScale = this.imageScalingFactor(Math.min(dropZone.width, dropZone.height) * 0.4, sprite.width, sprite.height);
                                sprite.setScale(imageScale, imageScale);
                                this.arrayDropped.add(sprite);
                                sprite.disableInteractive();
                                this.arrayStatic.remove(sprite);
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

    // ================================================================================================
    // Add progressbar
    // ================================================================================================
    private addProgressbar(): void {
        let multiplierX = 0.4;
        let multiplierY = 0.3;
        let progressbarY = this.cameras.main.height - 10;
        let progressbarCorrect = this.add.sprite(0, progressbarY, 'progressbar');
        progressbarCorrect.setOrigin(0, 1);
        progressbarCorrect.setScale(multiplierX, multiplierY);

        let progressbarCorrectX = 10 * 2 + progressbarCorrect.width * multiplierX;
        progressbarCorrect.setX(progressbarCorrectX);

        let progressbarWrong = this.add.sprite(10, progressbarY, 'progressbar');
        progressbarWrong.setOrigin(0, 1);
        progressbarWrong.setScale(multiplierX, multiplierY);

        let progressbarWrongX = 10; //10*2+progressbarWrong.width*multiplierX;
        progressbarWrong.setX(progressbarWrongX);

        let plus = this.add.sprite(progressbarCorrectX, progressbarY - progressbarWrong.height * multiplierY - 10, 'plus');
        let plusMultiplier = progressbarWrong.width * multiplierX / plus.width;
        plus.setOrigin(0, 1);
        plus.setScale(plusMultiplier, plusMultiplier);

        let minus = this.add.sprite(progressbarWrongX, progressbarY - progressbarWrong.height * multiplierY - 10, 'minus');
        let minusMultiplier = progressbarWrong.width * multiplierX / minus.width;
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

    // ======================================================================
    // Update progressbar
    // ======================================================================
    private updateProgressbar(point: integer): void {

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
