import "phaser";
import * as yaml from "js-yaml";
import Map = Phaser.Structs.Map;

export class GameScene extends Phaser.Scene {
    key: string = "GameScene";

    // HelpersMenu down?
    helpDown: boolean;

    // Our Object with name, imagepath and properties
    jsonObject: any;

    // How many cells (forming a grid)
    cellsX: number;
    cellsY: number;
    cellWidth: number;
    cellHeight: number;

    // Remaining stack  of images
    arrayStack: Phaser.GameObjects.Group;

    // Displayed images
    arrayDisplayed: Phaser.GameObjects.Group;

    // Marked images
    arrayMarked: Phaser.GameObjects.Group;

    // Already displayed images
    arrayDropped: Phaser.GameObjects.Group;

    // Coordinates of each grid cell center
    arrayCoordinates: number[][];


    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(data): void {
        this.helpDown = false;
        this.jsonObject = data.jsonObject;
        this.arrayStack = this.add.group();
        this.arrayDisplayed = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayMarked = this.add.group();

        // TODO: Cell input must come from userinput
        this.cellsX = 5;
        this.cellsY = 4;

        this.arrayCoordinates = [];
        let offsetX = 100;
        let offsetY = 30;
        this.cellWidth = (this.cameras.main.width-2*offsetX)/(this.cellsX);
        this.cellHeight = (this.cameras.main.height-2*offsetY)/(this.cellsY);
        for (let x = 0; x < this.cellsX; x++) {
            for (let y = 0; y < this.cellsY; y++) {
                this.arrayCoordinates.push([offsetX + this.cellWidth*(0.5+x), offsetY + this.cellHeight*(0.5+y)]);
            }
        }
    }

    preload(): void {
        // Helper menu graphics
        this.load.image("help", "assets/ui/help.png"/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image("menubackground", "assets/ui/menu_background.png" /*{ frameWidth: 352, frameHeight: 728 }*/);

        // Get Image names from json and save them in array
        for (let image of this.jsonObject["images"]) {
            let name = image.name;
            let path = "assets/geometrical_objects/images/"+name;
            this.load.image(name, path);
        }
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);

        // Set background color
        this.cameras.main.setBackgroundColor(0xb9b9b9);

        // ================================================================================================
        // Add helper menu
        // ================================================================================================
        // Menu background
        let menuBackground = this.add.image(this.cameras.main.width + 120, -220, "menubackground");
        menuBackground.setAngle(90);
        menuBackground.setOrigin(0, 0);
        menuBackground.setScale(0.15, 0.15);
        menuBackground.setTint(0xeeeeee);
        // MenuButton
        let menuButton = this.add.image(this.cameras.main.width - (16+32), 16+32, 'help');
        menuButton.setScale(0.17, 0.17);
        menuButton.setInteractive();

        menuButton.on('pointerup', () => this.menuAction(menuButton, menuBackground));

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();
        this.hideGroups();
        this.initiateCards();



        // ================================================================================================
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);
    }

    update(time: number): void {
        //if (this.arrayMarked >= 3)
    }

    // ================================================================================================
    // Card action
    hideGroups(): void {
        this.arrayStack.toggleVisible();
        //this.arrayDisplayed.toggleVisible();
        this.arrayDropped.toggleVisible();
        this.arrayMarked.toggleVisible();
    }

    loadCards(): void {
        for (let image of this.jsonObject["images"]) {
            let name = image.name;
            let cat1 = image.cat1;
            let cat2 = image.cat2;
            let cat3 = image.cat3;
            let cat4 = image.cat4;
            let sprite = this.add.sprite(200, 200, name);
            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            //sprite.visible = false;

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            let scale = this.max(this.cellHeight/sprite.height, this.cellWidth/sprite.width);
            sprite.setScale(scale, scale);
            sprite.setInteractive();

            sprite.on('pointerdown', function (event) {
                // Identify sprite
                let spriteName = sprite.name;

                // If not already selected and there aren't already three selected
                if (!this.arrayMarked.some((x) => x === spriteName) && this.arrayMarked.length < 3) {
                    // Mark card
                    sprite.setTint(0x999999);

                    // Add card to marked array
                    this.arrayMarked.push(sprite.name);
                } else if (this.arrayMarked.some((x) => x === spriteName)) {
                    // Unmark card
                    sprite.clearTint();

                    // Remove from marked array
                    this.arrayMarked.splice(this.arrayMarked.indexOf(spriteName), 1);

                }

            }, this);

            this.arrayStack.add(sprite);
        }
    }

    initiateCards(): void {
        for (let coords of this.arrayCoordinates) {
            let sprite = Phaser.Utils.Array.GetRandom(this.arrayStack.getChildren());
            sprite.setX(coords[0]);
            sprite.setY(coords[1]);
            this.arrayStack.remove(sprite);
            this.arrayDisplayed.add(sprite);
        }
    }

    replaceCards(): void {

    }
    /**
    replace(sprite: Phaser.GameObjects.Sprite): void {
        let x = sprite.x;
        let y = sprite.y;
        let name = sprite.name;
        let index = this.arrayDisplayed.indexOf(name);
        this.arrayDropped.push(this.arrayDisplayed[index]);
        let new_name = this.arrayStack.pop();
        this.arrayDisplayed[index] = new_name;
        sprite.destroy();
        sprite = this.add.sprite(x, y, new_name);
        sprite.setOrigin(0.5, 0.5);
        sprite.setAngle(Phaser.Math.RND.angle());

        let scale = this.min(this.cellHeight/sprite.height, this.cellWidth/sprite.width);
        sprite.setScale(scale, scale);
        sprite.setInteractive();
    }**/

    // ================================================================================================
    // Menu action
    menuAction(menuButton, menuBackground): void {
        // ButtonAnimation
        let menuButtonTween1 = this.tweens.add({
            targets: menuButton,
            scale: 0.21,
            ease: 'Bounce',
            yoyo: true,
            duration: 200
        });

        if (this.helpDown) {
            // Animation
            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                scaleX: 0.15,
                ease: "Cubic",
                duration: 500,
                delay: 100
            });

            this.helpDown = false;

        } else {
            // Animation
            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                scaleX: 0.5,
                ease: "Cubic",
                duration: 500
            });

            this.helpDown = true;
        }

    }

    // ================================================================================================
    // Helper functions
    min(val1, val2) {
        if (val1 < val2) {return val1}
        return val2;
    }

    max(val1, val2) {
        if (val1 > val2) {return val1}
        return val2;
    }
}

interface cat {
    name: string;
    valid: string[];
}

interface imageGameObject {
    name: string;
    cat1: string;
    cat2: string;
    cat3: string;
    cat4: string;
}
