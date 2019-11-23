import 'phaser';
import {BaseScene} from './BaseScene';

export class GameScene extends BaseScene {

    // Lock for not messing up animations by clicking repeatedly without waiting for the animation to finish
    private lock: boolean;

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
    private maxPoints: number;

    // Timeprogressbar
    private timefluid: Phaser.GameObjects.Sprite;

    // Gameprogressbar
    private gamefluid: Phaser.GameObjects.Sprite;
    private timedataStepsize: number;

    constructor() {
        super('GameScene');
    }


    init(data): void {
        this.lock = false;
        this.helpDown = false;
        this.jsonObject = data.jsonObject;
        this.arrayCategory = this.add.group();
        this.arrayStack = this.add.group();
        this.arrayDisplayed = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayMarked = this.add.group();
        this.checked = false;
        this.points = 0;

        // Level settings
        switch (data.setLevel) {
            case 1: {
                this.maxPoints = 10;
                this.timedataStepsize = 0.00001;

                break;
            }

            case 2: {
                this.maxPoints = 10;
                this.timedataStepsize = 0.0005;
                break;
            }

            case 3: {
                this.maxPoints = 10;
                this.timedataStepsize = 0.0001;
                break;
            }

            default: {
                console.log('Initialisation Error: setLevel is not 1, 2 or 3!');
                this.maxPoints = 0;

                break;
            }
        }


        this.cellsX = 3;
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

        this.load.image('gamebackground', 'assets/ui/game_background.png');

        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');

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

        // Get progressbar images
        this.load.image('timefluid', 'assets/ui/timefluid.png');
        this.load.image('gamefluid', 'assets/ui/gamefluid.png');
        this.load.image('progressbar', 'assets/ui/progressbar.png');
        this.load.image('progressstar', 'assets/ui/star.png');
        this.load.image('sandclock', 'assets/ui/sandclock.png');
    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        let background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);

        // ================================================================================================
        // Add helper menu
        // ================================================================================================

        this.helperMenu();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();
        this.initiateCards();
        this.checkForPossibleSet();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.createTimeProgressbar();
        this.createGameProgressbar();

        // ================================================================================================
        // Bring MenuUI to the front
        // ================================================================================================
    }

    update(time: number): void {
        // Check for correctness of selected cards
        if (this.arrayMarked.getLength() >= 3 && !this.checked) {
            this.checked = true;
            console.log('isSet: ' + this.isSet(this.arrayMarked.getChildren()));
            this.replaceCards(this.checkEquality(this.arrayMarked.getChildren()));
        }

        // Update timebar
        let timedata = this.timefluid.getData('timeY');
        if (timedata <= 0) {
            // Endgame
            this.game.scene.start('ScoreScene', {'score': this.points / this.maxPoints, 'previousScene': this.key});
            this.game.scene.stop(this.key);
            return;
        } else {
            timedata -= this.timedataStepsize;
            this.timefluid.setData('timeY', timedata);
            this.timefluid.setScale(this.timefluid.getData('timeX'), timedata);
        }
    }

    // ================================================================================================
    // Helper menu creation
    // ================================================================================================
    private helperMenu(): void {
        // Menu background
        let menuBackground = this.add.sprite(this.cameras.main.width - 64 - 10 - 30, 64 + 10 + 40, 'menubackground');
        menuBackground.setAngle(180);
        menuBackground.setOrigin(1, 0);
        menuBackground.setDisplaySize(500, this.cameras.main.height + 120);
        menuBackground.setTint(0xdddddd);

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
            let scale = this.imageScalingFactor(64, sprite.width, sprite.height);
            sprite.setScale(scale, scale);
            sprite.setVisible(true);
            this.arrayCategory.add(sprite);
        }

        // MenuButton
        let menuButton = this.add.sprite(this.cameras.main.width - (10 + 32), 10 + 32, 'help');
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
            // TODO: check if still instance of sprite. If not, all other code will fail!
            let sprite = this.arrayStack.create(200, 200, name);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            sprite.setVisible(false);

            let diag = Math.sqrt(Math.pow(sprite.height, 2) + Math.pow(sprite.width, 2));
            let scale = this.imageScalingFactor(Math.min(this.cellWidth, this.cellHeight), diag, diag);
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

                    // Remove helper/hint category tint
                    for (let cat of this.arrayCategory.getChildren()) {
                        if (cat instanceof Phaser.GameObjects.Sprite) {
                            cat.clearTint();
                        }
                    }

                    // Set checked to false
                    this.checked = false;
                }

            }, this);

            // should be redundant because of group.create()... this.arrayStack.add(sprite);
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
    private checkEquality(threeCards): boolean {
        let replaceCards = true;

        if (this.arrayMarked.getLength() < 3) {
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

                for (let spriteFirst of threeCards) {
                    for (let spriteSecond of threeCards) {

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

        return replaceCards;
    }

    // ================================================================================================
    // Equality check on three cards
    // ================================================================================================
    private isSet(threeCards): boolean {
        // Boolean: Equal until now?
        let eqCheck = false;
        // Boolean Different until now?
        let unEqCheck = false;
        for (let cat of this.arrayCategory.getChildren()) {
            // Make sure your objects are sprites
            if (cat instanceof Phaser.GameObjects.Sprite) {

                // Iterate through all cards. Check in sets of two for equality or inequality and remember this.
                // Check all 3 pair matchings.
                for (let spriteFirst of threeCards) {
                    for (let spriteSecond of threeCards) {

                        // Check if not the same sprite
                        if (!(spriteFirst === spriteSecond)) {

                            // Check if category the same or not
                            if (spriteFirst.getData(cat.name) === spriteSecond.getData(cat.name)) {

                                // Check if all categories are the same until now
                                if (unEqCheck) {
                                    return false;
                                }

                                if (!eqCheck) {
                                    eqCheck = true;
                                }

                            } else {
                                // Check if all categories are different until now
                                if (eqCheck) {

                                    return false;

                                }

                                if (!unEqCheck) {
                                    unEqCheck = true;
                                }
                            }
                            // Cat of all cards are the same or different until now => OK
                        }
                    }
                }
            }

            // Reset for every category
            eqCheck = false;
            unEqCheck = false;
        }

        return true;
    }

    // ================================================================================================
    // Replace marked cards
    // ================================================================================================
    private replaceCards(replaceCards: boolean): void {
        if (replaceCards) {
            for (let discardedCard of this.arrayMarked.getChildren()) {
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

            // ======================================================================
            // Update progressbar
            // ======================================================================
            this.points += this.gamefluid.getData('gameMax') / this.maxPoints;

            if (this.points >= this.gamefluid.getData('gameMax')) {
                this.gamefluid.setScale(this.gamefluid.getData('gameX'), this.points);
                // End game
                this.game.scene.start('ScoreScene');
                this.game.scene.stop(this.key);
                return;
            }

            this.gamefluid.setScale(this.gamefluid.getData('gameX'), this.points);

            // Remove helper/hint category tint
            for (let cat of this.arrayCategory.getChildren()) {
                if (cat instanceof Phaser.GameObjects.Sprite) {
                    cat.clearTint();
                }
            }

            this.checkForPossibleSet();

            // Set checked to false
            this.checked = false;
        }
    }

    // ================================================================================================
    // If you think there are no more pairs, refresh cards
    // ================================================================================================
    private checkForPossibleSet(): void {
        let cardSet = this.arrayDisplayed.getChildren();
        let cardSetLength = cardSet.length;

        for (let x = 0; x <= cardSetLength; x++) {
            for (let y = x + 1; y <= cardSetLength - (x + 1); y++) {
                for (let z = y + 1; z <= cardSetLength - (y + 1); z++) {
                    if (this.isSet([cardSet[x], cardSet[y], cardSet[z]])) {
                        console.log("Set available");
                        return;
                    }
                }
            }
        }
        console.log("no set available");
        // Replace/add cards
        this.refreshCards();
        // Do not replace/add cards
    }

    private refreshCards(): void {
        // Replace all cards
        console.log(this.arrayStack.getLength());
        for (let card of this.arrayDisplayed.getChildren()) {
            if (card instanceof Phaser.GameObjects.Sprite) {
                card.setVisible(false);
                this.arrayStack.add(card);
            }
        }
        this.arrayDisplayed.clear(false, false);
        console.log(this.arrayStack.getLength());
        this.initiateCards();

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
                y: 64 + 10 + 40,
                x: this.cameras.main.width - 64 - 10 - 30,
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
                y: this.cameras.main.height + 90,
                x: this.cameras.main.width - 64 - 10 - 50,
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
    // Game progressbar
    // ================================================================================================
    private createGameProgressbar(): void {
        let multiplierX = 0.4;
        let multiplierY = 0.3;
        let progressbarY = this.cameras.main.height - 10;
        let progressbar = this.add.sprite(0, progressbarY, 'progressbar');
        progressbar.setOrigin(0, 1);
        progressbar.setScale(multiplierX, multiplierY);

        let progressbarX = 10 * 2 + progressbar.width * multiplierX;
        progressbar.setX(progressbarX);

        let progressstar = this.add.sprite(progressbarX, progressbarY - progressbar.height * multiplierY - 10, 'progressstar');
        let starmultiplier = progressbar.width * multiplierX / progressstar.width;
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

    // ================================================================================================
    // Timeprogressbar
    // ================================================================================================
    private createTimeProgressbar(): void {
        let multiplierX = 0.4;
        let multiplierY = 0.3;
        let progressbarY = this.cameras.main.height - 10;
        let progressbar = this.add.sprite(10, progressbarY, 'progressbar');
        progressbar.setOrigin(0, 1);
        progressbar.setScale(multiplierX, multiplierY);

        let sandclock = this.add.sprite(10, progressbarY - progressbar.height * multiplierY - 10, 'sandclock');
        let starmultiplier = progressbar.width * multiplierX / sandclock.width;
        sandclock.setOrigin(0, 1);
        sandclock.setScale(starmultiplier, starmultiplier);

        this.timefluid = this.add.sprite(10 + progressbar.width * multiplierX / 2 + 2, progressbarY - 6, 'timefluid');
        this.timefluid.setOrigin(0.5, 1);
        this.timefluid.setData('timeX', multiplierX);
        this.timefluid.setData('timeY', (progressbar.height * multiplierY - 6) / this.timefluid.height);
        this.timefluid.setScale(this.timefluid.getData('timeX'), this.timefluid.getData('timeY'));
        this.timefluid.setAlpha(0.7);

    }
}
