import 'phaser';
import {BaseScene} from './BaseScene';

export class PropertySortingScene extends BaseScene {

    // Our Object with name, imagepath and properties
    private jsonObject: any;

    // Remaining stack  of images
    private arrayStack: Phaser.GameObjects.Container;

    private arrayStatic: Phaser.GameObjects.Group;

    private arrayFalling: Phaser.GameObjects.Group;

    private arrayDropped: Phaser.GameObjects.Group;

    private arrayCategory: Phaser.GameObjects.Group;

    private arrayDropZone: Phaser.GameObjects.Group;

    private cardDisplaySize: number;

    private setCat: number;

    private infinite: boolean;

    private correctBar: Phaser.GameObjects.Sprite;
    private wrongBar: Phaser.GameObjects.Sprite;

    private correctCount: number;
    private wrongCount: number;

    private propertyCount: number;

    private maxPoints: number;

    private velocity: number;
    private lastEmitTime: number;
    private delay: number;

    // 'pointerup' and 'drop' will be both triggered on drop so get lock.
    private dropped: boolean;

    constructor() {
        super('PropertySortingScene');
    }

    init(data): void {

        this.jsonObject = data.jsonObject;
        this.setCat = data.setCat;
        this.arrayStack = this.add.container(0, 0);
        this.arrayCategory = this.add.group();
        this.arrayStatic = this.add.group();
        this.arrayFalling = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayDropZone = this.add.group();
        this.cardDisplaySize = 100;

        let numberOfProperties = 0;
        for (let property of this.jsonObject['categories'][this.setCat - 1].validElements) {
            numberOfProperties++;
        }

        this.propertyCount = numberOfProperties;
        this.correctCount = 0;
        this.wrongCount = 0;

        // the same level category but another boolean if infinite or not
        this.infinite = data.infinite;

        this.velocity = 100;

        this.lastEmitTime = 0;
        this.delay = 3000;

        this.dropped = false;

    }

    preload(): void {

        this.load.image('gamebackground', 'assets/ui/sorting_background.png');

        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');

        // Wooden basket
        this.load.image('basket', 'assets/ui/wooden_crate.png');

        // Get propertie images
        for (let prop of this.jsonObject['categories'][this.setCat - 1].validElements) {
            if (prop.url === null) {
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
        // Add baskets
        // ================================================================================================

        this.initBaskets();

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
    // Add Baskets
    // ================================================================================================

    private initBaskets(): void {
        // For each property add a basket
        // evenly distributed
        // make snap to grid over basket
        // add one element of each prop

        let stepSize = this.cameras.main.width / (this.propertyCount + 1);
        let basketSize = this.cardDisplaySize * 2;
        let iteration = 1;

        for (let property of this.jsonObject['categories'][this.setCat - 1].validElements) {
            // Add basket
            let basket = this.add.sprite(stepSize * iteration, this.cameras.main.height - basketSize / 2, 'basket');
            basket.setOrigin(0.5, 0.5);

            let imageScalingFactor = this.imageScalingFactor(basketSize, basket.width, basket.height);
            basket.setScale(imageScalingFactor, imageScalingFactor);

            // Add zone around basket
            let zone = this.add.zone(basket.x, basket.y, basket.width * imageScalingFactor, basket.height * imageScalingFactor);
            zone.setOrigin(0.5, 0.5);
            zone.setRectangleDropZone(basket.width * imageScalingFactor, basket.height * imageScalingFactor);
            zone.setName(property.name);

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
                    let imageScale = this.imageScalingFactor(this.min(dropZone.width, dropZone.height) * 0.4, gameObject.width, gameObject.height);
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

        for (let propImage of this.jsonObject['categories'][this.setCat - 1].validElements) {
            let propImageName = propImage.name;

            // Create 10 of each property
            for (let i = 0; i < 5; i++) {
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

