import "phaser";
import * as yaml from "js-yaml";

export class GameScene extends Phaser.Scene {
    key: string = "GameScene";

    // Our Object with name, imagepath and properties
    jsonObject: any;

    // How many cells (forming a grid)
    cellsX: number;
    cellsY: number;
    cellWidth: number;
    cellHeight: number;

    // Displayed images
    arrayDisplayed: string[];

    // Already displayed images
    arrayDropped: string[];

    // Remaining stack  of images
    arrayStack: string[];

    // Coordinates of each grid cell center
    arrayCoordinates: number[][];


    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(data): void {
        this.jsonObject = data.jsonObject;
        this.cellsX = 3;
        this.cellsY = 4;
        this.arrayStack = [];
        this.arrayDisplayed = [];
        this.arrayDropped = [];

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
        // Get Image names from json and save them in array

        for (let image of this.jsonObject["images"]) {
            let name = image.name;
            let path = "assets/geometrical_objects/images/"+name;
            this.arrayStack.push(name);
            this.load.image(name, path);
        }
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);

        // Add cards
        while (this.arrayDisplayed.length < this.cellsY*this.cellsX) {
            Phaser.Math.RND.shuffle(this.arrayStack);
            let pick = this.arrayStack.pop();
            this.arrayDisplayed.push(pick);
        }

        for (let image of this.arrayDisplayed) {
            let x = this.arrayCoordinates[this.arrayDisplayed.indexOf(image)][0];
            let y = this.arrayCoordinates[this.arrayDisplayed.indexOf(image)][1];
            let sprite = this.add.sprite(x, y, image);
            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            let scale = this.min(this.cellHeight/sprite.height, this.cellWidth/sprite.width);
            sprite.setScale(scale, scale);
            sprite.setInteractive();

            sprite.on('pointerdown', function (event) {
                this.setTint(0x999999);

            });



            sprite.on('pointerup', function (event) {
                this.clearTint();
                this.destroy();

            });

        }
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);
    }

    update(time: number): void {

    }

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

    }

    min(val1, val2) {
        if (val1 < val2) {return val1}
        return val2;
    }

    private validityChecker(object: any): void {
        let allCategories: cat[] = object["categories"];
        let allImages: imageGameObject[] = object["images"];

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
