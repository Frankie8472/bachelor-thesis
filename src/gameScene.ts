import 'phaser';
import {BaseScene} from './BaseScene';

export class GameScene extends BaseScene {

    /**
     * Object data file
     */
    private jsonObject: any;

    /**
     * Game level
     */
    private level: number;

    /**
     * Lock for not messing up animations by clicking repeatedly without waiting for the animation to finish
     */
    private lock: boolean;

    /**
     * State of the helper menu and data
     */
    private helpDown: boolean;
    private buttonSize: number;

    /**
     * Lock for checking the marked objects
     */
    private checked: boolean;

    /**
     * Array of objects in play
     */
    private gameSet: any[];

    /**
     * Copy of the categories
     */
    private categorySet: any[];


    /**
     * Grid properties
     */
    private cellsX: number;
    private cellsY: number;
    private cellWidth: number;
    private cellHeight: number;

    /**
     * Center coordinates of each grid cell
     */
    private arrayCoordinates: number[][];

    /**
     * All category objects
     */
    private arrayCategory: Phaser.GameObjects.Group;

    /**
     * All remaining (not yet discarded) objects
     */
    private arrayStack: Phaser.GameObjects.Group;

    /**
     * All displayed objects
     */
    private arrayDisplayed: Phaser.GameObjects.Group;

    /**
     * All marked objects
     */
    private arrayMarked: Phaser.GameObjects.Group;

    /**
     * All correctly indentified object sets
     */
    private arrayDropped: Phaser.GameObjects.Group;

    /**
     * Stats of already found sets
     */
    private points: number;
    private maxPoints: number;

    /**
     * Timeprogressbar
     */
    private timefluid: Phaser.GameObjects.Sprite;

    /**
     * Gameprogressbar and data
     */
    private gamefluid: Phaser.GameObjects.Sprite;
    private timedataStepsize: number;

    constructor() {
        super('GameScene');
    }

    init(data): void {

        // Initialize data from previous scene
        this.jsonObject = this.cache.json.get('objects');
        this.level = data.level;

        // Initialize fields
        this.lock = false;
        this.helpDown = false;
        this.gameSet = [];
        this.categorySet = [];
        this.arrayCategory = this.add.group();
        this.arrayStack = this.add.group();
        this.arrayDisplayed = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayMarked = this.add.group();
        this.checked = false;
        this.points = 0;

        // Initialize game parameters
        this.buttonSize = 64;

        this.maxPoints = 10;

        this.timedataStepsize = 0.0001;

        if (this.level > 1) {
            this.timedataStepsize = 0.00001;
        }

        this.cellsX = 4;
        this.cellsY = 3;

        this.arrayCoordinates = [];
        let offsetX = 100;
        let offsetY = 30;
        this.cellWidth = (this.cameras.main.width - 2 * offsetX) / (this.cellsX);
        this.cellHeight = (this.cameras.main.height - 2 * offsetY) / (this.cellsY);
        for (let x = 0; x < this.cellsX; x++) {
            for (let y = 0; y < this.cellsY; y++) {
                this.arrayCoordinates.push([offsetX + this.cellWidth * (0.5 + x), offsetY + this.cellHeight * (0.5 + y)]);
            }
        }


    }

    preload(): void {
    }

    create(): void {
        // Bring MenuUI to the front and initialize transition
        this.game.scene.sendToBack(this.getKey());
        this.transitionIn();

        this.preselectObjects();
        this.setBackground();
        this.setHelperMenu();
        this.loadObjects();
        this.initObjects();
        this.setEqualityCheck();
        this.setTimeProgressbar();
        this.setGameProgressbar();
        this.introduction();
        this.initAudio();
    }

    update(time: number): void {

        // Check for correctness of selected cards
        if (!this.checked && this.arrayMarked.getLength() >= 3) {
            this.checked = true;
            const objects: Phaser.GameObjects.GameObject[] = this.arrayMarked.getChildren();
            this.replaceObject(this.checkEquality(objects[0], objects[1], objects[2], true));
        }

        // Update timeprogressbar
        let timedata: number = this.timefluid.getData('timeY');
        if (!this.checked && timedata <= 0) {
            this.checked = true;

            // Endgame
            this.transitionOut('ScoreScene', {'score': this.points / this.gamefluid.getData('gameMax'), 'previousScene': this.getKey() + String(this.level)});
        } else {
            timedata -= this.timedataStepsize;
            this.timefluid.setData('timeY', timedata);
            this.timefluid.setScale(this.timefluid.getData('timeX'), timedata);
        }
    }

    /**
     * Method for preselecting objects
     */
    private preselectObjects(): void {
        // Preselect objects and preload images
        const selectedProperties: any[] = [];
        // Choose three random properties of each category
        for (let cat of this.jsonObject['categories']) {
            const selectedProperty: any[] = Phaser.Math.RND.shuffle(cat['validElements']).slice(0, 3);
            selectedProperty.forEach((object, index, array) => array[index] = object.name);
            selectedProperties.push(selectedProperty);
        }

        // Choose all image
        for (let image of this.jsonObject['images']) {
            if (
                selectedProperties[0].indexOf(image['cat1']) > -1 &&
                selectedProperties[1].indexOf(image['cat2']) > -1 &&
                selectedProperties[2].indexOf(image['cat3']) > -1
            ) {
                // If level one, fix the last category
                if (this.level === 1) {
                    if (image['cat4'] === 'full') {
                        this.gameSet.push(image);
                    }
                } else {
                    this.gameSet.push(image);
                }
            }
        }

        // Preload category images
        this.categorySet = [...this.jsonObject['categories']]; // Full copy the array instead of referencing

        // If level one, ignore the last category
        if (this.level === 1) {
            this.categorySet.pop();
        }
    }

    /**
     * Function for initializing the background
     */
    private setBackground(): void {
        const background = this.add.sprite(0, 0, 'background5');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);
    }

    /**
     * Function for creating the helper menu
     */
    private setHelperMenu(): void {
        // Menu background
        const backgroundY: number = 64 + 10 + 30;
        const menuBackground: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - 64 - 10 - 30, backgroundY, 'menubackground');
        menuBackground.setAngle(180);
        menuBackground.setOrigin(1, 0);
        menuBackground.setDisplaySize(500, this.cameras.main.height + 120);
        menuBackground.setTint(0xdddddd);
        menuBackground.setData('y', backgroundY);

        // Category indicator
        let y: number = 16 + 32;
        let countCategories: number = 0;


        for (let cat of this.categorySet) {
            if (cat.url === null || cat.name === null) {
                continue;
            }
            countCategories++;
        }

        for (let cat of this.categorySet) {
            if (cat.url === null || cat.name === null) {
                continue;
            }

            y += (this.cameras.main.height - (16 + 32)) / (countCategories + 1);
            let name: string = cat.name;
            const sprite: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width + 64, y, name);
            sprite.setName(name);
            sprite.setOrigin(0.5, 0.5);

            const scale: number = this.imageScalingFactor(this.buttonSize, sprite.width, sprite.height);
            sprite.setScale(scale, scale);

            sprite.setVisible(true);

            this.arrayCategory.add(sprite);
        }

        // MenuButton
        const menuButton: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width - (10 + 32), 10 + 32, 'help');

        const scale: number = this.imageScalingFactor(this.buttonSize, menuButton.width, menuButton.height);
        menuButton.setScale(scale, scale);
        menuButton.setInteractive({ cursor: 'pointer' });

        menuButton.on('pointerup', () => this.menuAction(menuButton, menuBackground));
    }

    /**
     * Function fot loading all objects as sprites and data initialization
     */
    private loadObjects(): void {
        for (let image of this.gameSet) {
            const name: string = image.name;
            const cat1: string = image.cat1;
            const cat2: string = image.cat2;
            const cat3: string = image.cat3;
            const cat4: string = image.cat4;
            const sprite: Phaser.GameObjects.Sprite = this.arrayStack.create(200, 200, name);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            sprite.setVisible(false);

            const diag: number = Math.sqrt(Math.pow(sprite.height, 2) + Math.pow(sprite.width, 2));
            const scale: number = this.imageScalingFactor(Math.min(this.cellWidth, this.cellHeight), diag, diag);
            sprite.setScale(scale, scale);
            sprite.setInteractive({ cursor: 'pointer' });

            sprite.on('pointerdown', function() {

                // If not already selected and there aren't already three selected
                if (!this.arrayMarked.contains(sprite) && this.arrayMarked.getLength() < 3) {

                    // Mark card
                    sprite.setTint(0x999999);

                    // Add card to marked array
                    this.arrayMarked.add(sprite);

                    // Set checked to false
                    this.checked = false;

                } else if (this.arrayMarked.contains(sprite)) {

                    // Unmark card
                    sprite.clearTint();

                    // Remove from marked array
                    this.arrayMarked.remove(sprite);

                    this.resetHelp();

                    // Set checked to false
                    this.checked = false;
                }
            }, this);
        }
    }

    /**
     * Function for initializing the first set of displayed objects
     */
    private initObjects(): void {

        for (let coords of this.arrayCoordinates) {
            const sprite: Phaser.GameObjects.Sprite = Phaser.Math.RND.pick(this.arrayStack.getChildren());

            sprite.setX(coords[0]);
            sprite.setY(coords[1]);

            sprite.setVisible(true);

            this.arrayStack.remove(sprite);
            this.arrayDisplayed.add(sprite);
        }
    }

    /**
     * Function for checking for set equality.
     * All properties of one category have to be equal or inherently different.
     * @param sprite1 First set object
     * @param sprite2 Second set object
     * @param sprite3 Third set object
     * @param inGame Boolean: Shall the indicator for ingame help be marked?
     */
    private checkEquality(sprite1: Phaser.GameObjects.GameObject, sprite2: Phaser.GameObjects.GameObject, sprite3: Phaser.GameObjects.GameObject, inGame: boolean): boolean {
        if (sprite1 instanceof Phaser.GameObjects.Sprite &&
            sprite2 instanceof Phaser.GameObjects.Sprite &&
            sprite3 instanceof Phaser.GameObjects.Sprite
        ) {
            // Return value
            let replaceObjects: boolean = true;

            for (let categoryIndicator of this.arrayCategory.getChildren()) {

                // Make sure your objects are sprites
                if (categoryIndicator instanceof Phaser.GameObjects.Sprite) {

                    // Clear tint
                    categoryIndicator.clearTint();

                    if (
                        sprite1.getData(categoryIndicator.name) === sprite2.getData(categoryIndicator.name) &&
                        sprite2.getData(categoryIndicator.name) === sprite3.getData(categoryIndicator.name) &&
                        sprite1.getData(categoryIndicator.name) === sprite3.getData(categoryIndicator.name)
                    ) {
                        if (inGame) {
                            categoryIndicator.setTintFill(0x00dd00);
                        }
                    } else if (
                        !(sprite1.getData(categoryIndicator.name) === sprite2.getData(categoryIndicator.name)) &&
                        !(sprite2.getData(categoryIndicator.name) === sprite3.getData(categoryIndicator.name)) &&
                        !(sprite1.getData(categoryIndicator.name) === sprite3.getData(categoryIndicator.name))
                    ) {
                        if(inGame){
                            categoryIndicator.setTintFill(0x00dd00);
                        }
                    } else {
                        if (replaceObjects) {
                            replaceObjects = false;
                        }
                        if (inGame){
                            // Mark category as red
                            categoryIndicator.setTintFill(0xdd0000);
                        }
                    }
                }
            }
            return replaceObjects;
        }
    }

    /**
     * Function for replacing marked objects
     * @param replaceObject
     */
    private replaceObject(replaceObject: boolean): void {
        if (replaceObject) {
            for (let oldSprite of this.arrayMarked.getChildren()) {
                if (oldSprite instanceof Phaser.GameObjects.Sprite) {
                    oldSprite.clearTint();
                    oldSprite.setVisible(false);
                    this.arrayDisplayed.remove(oldSprite);
                    this.arrayDropped.add(oldSprite);

                    if (this.arrayStack.getLength() <= 0) {
                        this.arrayDropped.getChildren().forEach((element) => this.arrayStack.add(element));
                        this.arrayDropped.clear(false, false);
                    }

                    const newSprite: Phaser.GameObjects.Sprite = Phaser.Math.RND.pick(this.arrayStack.getChildren());
                    newSprite.setPosition(oldSprite.x, oldSprite.y);
                    newSprite.setVisible(true);
                    this.arrayStack.remove(newSprite);
                    this.arrayDisplayed.add(newSprite);
                }
            }

            this.arrayMarked.clear(false, false);

            this.resetHelp();

            this.setEqualityCheck();

            // Set checked to false
            this.checked = false;

            this.updateProgressbar();
        }
    }

    /**
     * Function for reseting the tint on the helper menu
     */
    private resetHelp(): void {
        for (let cat of this.arrayCategory.getChildren()) {
            if (cat instanceof Phaser.GameObjects.Sprite) {
                cat.clearTint();
            }
        }
    }

    /**
     * Function for updating the progressbar
     */
    private updateProgressbar(): void {
        this.points += this.gamefluid.getData('gameMax') / this.maxPoints;

        // Add time but not more than max
        let timedata: number = this.timefluid.getData('timeY');
        timedata += this.timedataStepsize*5000;
        if (timedata > this.timefluid.getData('timeYMax')){
            timedata = this.timefluid.getData('timeYMax');
        }

        this.timefluid.setScale(this.timefluid.getData('timeX'), timedata);
        this.timefluid.setData('timeY', timedata);

        if (this.points >= this.gamefluid.getData('gameMax') - Phaser.Math.EPSILON) {
            this.checked = true;

            // Disable further interaction with the objects
            this.arrayDisplayed.getChildren().forEach((gameObject) => gameObject.disableInteractive());

            this.gamefluid.setScale(this.gamefluid.getData('gameX'), this.points);

            // End game
            this.transitionOut('ScoreScene', {'score': 1, 'previousScene': this.getKey() + String(this.level)});

        }

        this.gamefluid.setScale(this.gamefluid.getData('gameX'), this.points);
    }

    /**
     * Function for checking if there is a occurrence of a set in the displayed objects
     */
    private setEqualityCheck(): void {
        const objectSet: Phaser.GameObjects.GameObject[] = this.arrayDisplayed.getChildren();
        const objectSetLength: number = objectSet.length;

        for (let x = 0; x <= objectSetLength; x++) {
            for (let y = x + 1; y <= objectSetLength - (x + 1); y++) {
                for (let z = y + 1; z <= objectSetLength - (y + 1); z++) {
                    if (this.checkEquality(objectSet[x], objectSet[y], objectSet[z], false)) {
                        return;
                    }
                }
            }
        }

        // Replace/add cards
        this.rebuildDisplayedObjects();
    }

    /**
     * Function for refreshing all displayed objects with new ones
     * Usually used if there is no occurrence of a set.
     */
    private rebuildDisplayedObjects(): void {

        // Replace all cards
        for (let card of this.arrayDisplayed.getChildren()) {
            if (card instanceof Phaser.GameObjects.Sprite) {
                card.setVisible(false);
                this.arrayStack.add(card);
            }
        }

        this.arrayDisplayed.clear(false, false);

        this.initObjects();

    }

    /**
     * Function for initializing the animation on the helpers menu
     * @param menuButton The helpers menu button
     * @param menuBackground The helpers menu background
     */
    private menuAction(menuButton, menuBackground): void {
        // ButtonAnimation
        const menuButtonTween1: Phaser.Tweens.Tween = this.tweens.add({
            targets: menuButton,
            scale: 0.37,
            ease: 'linear',
            yoyo: true,
            duration: 200
        });

        // Retract
        if (this.helpDown) {
            const menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuBackground,
                y: menuBackground.getData('y'),
                x: this.cameras.main.width - 64 - 10 - 30,
                ease: 'Cubic',
                duration: 500,
                delay: 100
            });

            for (let helperButton of this.arrayCategory.getChildren()) {
                let helperButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                    targets: helperButton,
                    x: this.cameras.main.width + 64,
                    ease: 'Cubic',
                    duration: 300
                });
            }


            this.helpDown = false;

            // Extend
        } else {
            let menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuBackground,
                y: this.cameras.main.height + 90,
                x: this.cameras.main.width - 64 - 10 - 50,
                ease: 'Cubic',
                duration: 500
            });

            for (let helperButton of this.arrayCategory.getChildren()) {
                let helperButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                    targets: helperButton,
                    x: this.cameras.main.width - (16 + 32) + 4,
                    ease: 'Cubic',
                    duration: 300
                });
            }

            this.helpDown = true;
        }

    }

    /**
     * Function for initializing the progressbar for ingame game score
     */
    private setGameProgressbar(): void {
        const progressbarY: number = this.cameras.main.height - 10;
        const progressbar: Phaser.GameObjects.Sprite = this.add.sprite(0, progressbarY, 'progressbar');
        const multiplierX: number = 0.4;
        const multiplierY: number = this.imageScalingFactor(this.cameras.main.height*0.5, progressbar.height, progressbar.height);//0.3;
        progressbar.setOrigin(0, 1);
        progressbar.setScale(multiplierX, multiplierY);

        const progressbarX: number = 10 * 2 + progressbar.width * multiplierX;
        progressbar.setX(progressbarX);

        const progressstar: Phaser.GameObjects.Sprite = this.add.sprite(progressbarX, progressbarY - progressbar.height * multiplierY - 10, 'progressstar');
        const starmultiplier: number = progressbar.width * multiplierX / progressstar.width;
        progressstar.setOrigin(0, 1);
        progressstar.setScale(starmultiplier, starmultiplier);

        this.gamefluid = this.add.sprite(progressbarX + progressbar.width * multiplierX / 2 + 2, progressbarY - 6, 'gamefluid');
        this.gamefluid.setOrigin(0.5, 1);
        this.gamefluid.setData('gameX', multiplierX);
        this.gamefluid.setData('gameY', 0.01);
        this.gamefluid.setData('gameMax', (progressbar.height * multiplierY - 6) / this.gamefluid.height);
        this.gamefluid.setScale(multiplierX, 0.01);
        this.gamefluid.setAlpha(0.7);
    }

    /**
     * Function for initializing the game timer
     */
    private setTimeProgressbar(): void {
        const progressbarY: number = this.cameras.main.height - 10;
        const progressbar: Phaser.GameObjects.Sprite = this.add.sprite(10, progressbarY, 'progressbar');
        const multiplierX: number = 0.4;
        const multiplierY: number = this.imageScalingFactor(this.cameras.main.height*0.5, progressbar.height, progressbar.height);//0.3;
        progressbar.setOrigin(0, 1);
        progressbar.setScale(multiplierX, multiplierY);

        const hourglass: Phaser.GameObjects.Sprite = this.add.sprite(10, progressbarY - progressbar.height * multiplierY - 10, 'hourglass');
        const starmultiplier: number = progressbar.width * multiplierX / hourglass.width;
        hourglass.setOrigin(0, 1);
        hourglass.setScale(starmultiplier, starmultiplier);

        this.timefluid = this.add.sprite(10 + progressbar.width * multiplierX / 2 + 2, progressbarY - 6, 'timefluid');
        this.timefluid.setOrigin(0.5, 1);
        this.timefluid.setData('timeX', multiplierX);
        this.timefluid.setData('timeY', (progressbar.height * multiplierY - 6) / this.timefluid.height);
        this.timefluid.setData('timeYMax', (progressbar.height * multiplierY - 6) / this.timefluid.height);
        this.timefluid.setScale(this.timefluid.getData('timeX'), this.timefluid.getData('timeY'));
        this.timefluid.setAlpha(0.7);
    }

    /**
     * Function for calling the introduction and pause this scene
     */
    private introduction(): void {
        this.scene.pause();
        this.game.scene.start("IntroScene", {"pausedScene": this.getKey()});
    }

    /**
     * Function for initializing soundeffects
     */
    private initAudio(): void {
        this.sound.add('loading').play('', {loop: true});
    }
}
