import 'phaser';
import * as yaml from 'js-yaml';
import Map = Phaser.Structs.Map;

export class GameScene extends Phaser.Scene {
    key: string = 'GameScene';

    // HelpersMenu down?
    private helpDown: boolean;

    // Our Object with name, imagepath and properties
    private jsonObject: any;

    // How many cells (forming a grid)
    private cellsX: number;
    private cellsY: number;
    private cellWidth: number;
    private cellHeight: number;

    // Category sprites
    private arrayCategory: Phaser.GameObjects.Group;

    // Remaining stack  of images
    private arrayStack: Phaser.GameObjects.Group;

    // Displayed images
    private arrayDisplayed: Phaser.GameObjects.Group;

    // Marked images
    private arrayMarked: Phaser.GameObjects.Group;

    // Already displayed images
    private arrayDropped: Phaser.GameObjects.Group;

    // Coordinates of each grid cell center
    private arrayCoordinates: number[][];

    // Already checked the three marked objects?
    private checked: boolean;

    // How many matching cards have you found?
    private points: number;


    constructor() {
        super({
            key: 'GameScene'
        });
    }

    init(data): void {
        this.helpDown = false;
        this.jsonObject = data.jsonObject;
        this.arrayCategory = this.add.group();
        this.arrayStack = this.add.group();
        this.arrayDisplayed = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayMarked = this.add.group();
        this.checked = false;

        // TODO: Cell input must come from userinput
        this.cellsX = 5;
        this.cellsY = 4;

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
        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png' /*{ frameWidth: 352, frameHeight: 728 }*/);

        // Get Image names from json and save them in array
        for (let image of this.jsonObject['images']) {
            let name = image.name;
            let path = 'assets/geometrical_objects/images/' + name;
            this.load.image(name, path);
        }

        // Get categories
        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }

            let name = cat.name;
            let path = 'assets/geometrical_objects/categories/' + cat.url;
            this.load.image(name, path);

        }
    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.moveDown(this.key);

        this.cameras.main.setBackgroundColor(0xb9b9b9);

        // ================================================================================================
        // Add helper menu
        // ================================================================================================

        this.helperMenu();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();
        this.initiateCards();

        // ================================================================================================
        // Bring MenuUI to the front
        // ================================================================================================

        this.game.scene.moveDown(this.key);
    }

    update(time: number): void {
        if (this.arrayMarked.getLength() >= 1 && !this.checked) {
            this.checked = true;
            this.checkEquality();
        }
    }

    // ================================================================================================
    // Helper menu creation
    // ================================================================================================
    private helperMenu(): void {
        // Menu background
        let menuBackground = this.add.image(this.cameras.main.width - 64-10-30, 64+10+40, 'menubackground');
        menuBackground.setAngle(180);
        menuBackground.setOrigin(1, 0);
        menuBackground.setDisplaySize(500, this.cameras.main.height+100);
        menuBackground.setTint(0xeeeeee);

        // Category indicator
        let y = 16 + 32;
        let countCategories = 0;

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

            y += (this.cameras.main.height - (16 + 32)) / (countCategories + 1);
            let name = cat.name;
            let sprite = this.add.sprite(this.cameras.main.width + 64, y, name);
            sprite.setName(name);
            sprite.setOrigin(0.5, 0.5);
            sprite.setDisplaySize(64, 64);
            sprite.setVisible(true);
            this.arrayCategory.add(sprite);
        }

        // MenuButton
        let menuButton = this.add.image(this.cameras.main.width - (10 + 32), 10 + 32, 'help');
        menuButton.setDisplaySize(64, 64);
        menuButton.setInteractive();

        menuButton.on('pointerup', () => this.menuAction(menuButton, menuBackground));
    }

    // ================================================================================================
    // Card action
    // ================================================================================================
    private loadCards(): void {
        for (let image of this.jsonObject['images']) {
            let name = image.name;
            let cat1 = image.cat1;
            let cat2 = image.cat2;
            let cat3 = image.cat3;
            let cat4 = image.cat4;
            let sprite = this.add.sprite(200, 200, name);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            sprite.setVisible(false);

            let scale = this.max(this.cellHeight / sprite.height, this.cellWidth / sprite.width);
            sprite.setScale(scale, scale);
            sprite.setInteractive();

            sprite.on('pointerdown', function(event) {

                if (!this.arrayMarked.contains(sprite) && this.arrayMarked.getLength() < 3) {
                    // If not already selected and there aren't already three selected
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

                    // Set checked to false
                    this.checked = false;
                }

            }, this);

            this.arrayStack.add(sprite);
        }
    }

    // ================================================================================================
    // Initialize cards
    // ================================================================================================
    private initiateCards(): void {
        for (let coords of this.arrayCoordinates) {
            let sprite = Phaser.Utils.Array.GetRandom(this.arrayStack.getChildren());
            if (sprite instanceof Phaser.GameObjects.Sprite) {
                sprite.setX(coords[0]);
                sprite.setY(coords[1]);
                sprite.setVisible(true);
                this.arrayStack.remove(sprite);
                this.arrayDisplayed.add(sprite);
            } else {
                console.log('ERROR: element in arrayStack is not a sprite!');
            }

        }
    }

    // ================================================================================================
    // Equality check on a full stack
    // ================================================================================================
    private checkEquality(): void {
        let replaceCards = true;

        if (this.arrayMarked.getLength() >= 3) {
            replaceCards = false;
        }

        // Boolean: Equal until now?
        let eqCheck = false;
        // Boolean Different until now?
        let unEqCheck = false;
        for (let cat of this.arrayCategory.getChildren()) {
            // Make sure your objects are sprites
            if (cat instanceof Phaser.GameObjects.Sprite) {
                // Clear tint
                cat.clearTint();

                for (let spriteFirst of this.arrayMarked.getChildren()) {
                    for (let spriteSecond of this.arrayMarked.getChildren()) {

                        // Check if not the same sprite
                        if (!(spriteFirst === spriteSecond)) {

                            // Check if category the same or not
                            if (spriteFirst.getData(cat.name) === spriteSecond.getData(cat.name)) {

                                // Check if all categories are the same
                                if (unEqCheck) {
                                    // Block whole category
                                    eqCheck = true;

                                    // Do not replace cards
                                    if (replaceCards) {
                                        replaceCards = false;
                                    }

                                    // Mark category as red
                                    cat.setTintFill(0xdd0000);
                                    continue;
                                }

                                if (!eqCheck) {
                                    eqCheck = true;
                                }

                            } else {
                                // Check if all categories are different until now
                                if (eqCheck) {
                                    // Block whole category
                                    unEqCheck = true;

                                    // Do not replace cards
                                    if (replaceCards) {
                                        replaceCards = false;
                                    }

                                    // Mark category as red
                                    cat.setTintFill(0xdd0000);
                                    continue;
                                }

                                if (!unEqCheck) {
                                    unEqCheck = true;
                                }
                            }
                            // Cat of all cards are the same or different until now => OK
                            // Mark category as green
                            cat.setTintFill(0x00dd00);

                        }
                    }
                }
            }

            // Reset for every category
            eqCheck = false;
            unEqCheck = false;
        }

        this.replaceCards(replaceCards);


    }

    // ================================================================================================
    // Replace marked cards
    // ================================================================================================
    private replaceCards(replaceCards: boolean): void {
        if (replaceCards) {
            for (let discardedCard of this.arrayMarked.getChildren()) {
                console.log(discardedCard.name);
                let newSprite = Phaser.Utils.Array.GetRandom(this.arrayStack.getChildren());
                if (newSprite instanceof Phaser.GameObjects.Sprite && discardedCard instanceof Phaser.GameObjects.Sprite) {
                    newSprite.setX(discardedCard.x);
                    newSprite.setY(discardedCard.y);

                    discardedCard.clearTint();
                    discardedCard.setVisible(false);

                    newSprite.setVisible(true);

                    this.arrayStack.remove(newSprite);
                    this.arrayDisplayed.add(newSprite);
                } else {
                    console.log('ERROR: element in arrayStack or arrayMarked is not a sprite!');
                }
                this.arrayDisplayed.remove(discardedCard);
                this.arrayDropped.add(discardedCard);

            }
            this.arrayMarked.clear(true, false);

            // Set checked to false
            this.checked = false;
        }
    }

    // ================================================================================================
    // Menu action
    // ================================================================================================
    private menuAction(menuButton, menuBackground): void {
        // ButtonAnimation
        let menuButtonTween1 = this.tweens.add({
            targets: menuButton,
            scale: 0.37,
            ease: 'linear',
            yoyo: true,
            duration: 200
        });

        // Retract
        if (this.helpDown) {
            // Animation
            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                y: 64+10+40,
                x: this.cameras.main.width - 64-10-30,
                ease: 'Cubic',
                duration: 500,
                delay: 100
            });

            for (let helperButton of this.arrayCategory.getChildren()) {
                let helperButtonTween = this.tweens.add({
                    targets: helperButton,
                    x: this.cameras.main.width + 64,
                    ease: 'Cubic',
                    duration: 300
                });
            }


            this.helpDown = false;

        // Extend
        } else {
            // Animation
            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                y: this.cameras.main.height + 50,
                x: this.cameras.main.width - 64-10-50,
                ease: 'Cubic',
                duration: 500
            });

            for (let helperButton of this.arrayCategory.getChildren()) {
                let helperButtonTween = this.tweens.add({
                    targets: helperButton,
                    x: this.cameras.main.width - (16 + 32) + 4,
                    ease: 'Cubic',
                    duration: 300
                });
            }

            this.helpDown = true;
        }

    }

    // ================================================================================================
    // Gameprogressbar
    // ================================================================================================
    private createGameProgressbar(): void {
        // size & position
        let width = 400;
        let height = 20;
        let xStart =  - width / 2;
        let yStart =  - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        /**
         * Updates the progress bar.
         *
         * @param {number} percentage
         */
        let updateProgressbar = function(percentage) {
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function() {

            this.load.off('progress', updateProgressbar);
            this.scene.start('title');

        }, this);
    }

    // ================================================================================================
    // Timeprogressbar
    // ================================================================================================
    private createTimeProgressbar (): void {

    }

    // ================================================================================================
    // Helper functions
    // ================================================================================================
    private min(val1, val2) {
        if (val1 < val2) {
            return val1;
        }
        return val2;
    }

    private max(val1, val2) {
        if (val1 > val2) {
            return val1;
        }
        return val2;
    }

}
