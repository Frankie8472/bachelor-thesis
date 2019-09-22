import "phaser";
import * as yaml from "js-yaml";

export class GameScene extends Phaser.Scene {
    key: string = "GameScene";

    objectArray: string[];
    selectionArray: any[];
    displayedArray: any[];
    usedArray: any[];
    grid: Phaser.GameObjects.Group;


    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(/*params: any*/): void {
        this.objectArray = [];
        this.grid = this.add.group();
    }

    preload(): void {
        // Load json
        this.load.json("objects", "assets/geometrical_objects/geometrical_objects.json");


        /**
        // Load all images and add names to array
        this.cache.json.get("objects")["images"] {}

        let group = this.add.group();


        object["images"].forEach((obj) => this.objectArray.push(obj));
        for (var i = 0; i < this.objectArray.length; i++) {
            this.load.image("image" + i, "asset/geometrical_objects/images"+this.objectArray[i]["name"]);
        }

        if (this.selectionArray.length <= 6) {
            let rnd = Phaser.Math.RND.pick(this.objectArray);
            this.selectionArray.push(rnd)
        }

        this.selectionArray.forEach((elem) => this);

        //let doc = JSON.parse("../assets/geometrical_objects/gemetrical_objects.json");
        //let doc = yaml.safeLoad(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
        //console.log(doc.image[0].name);
        //console.log(doc);
        //doc.['image'].['name']
        //this.load.json("buttons", "assets/geometrical_objects/gemoetrical_objects.json");
        // this.load.setBaseURL("https://raw.githubusercontent.com/mariyadavydova/" +
        //     "starfall-phaser3-typescript/master/");
        // this.load.image("star", "assets/star.png");
        // this.load.image("sand", "assets/sand.jpg");**/
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);

        // Get Image names from json and save them in array
        let jsonObject = this.cache.json.get("objects");

        for (let image of jsonObject["images"]) {
            let name = image.name;
            let path = "asset/geometrical_objects/images/"+name;
            this.objectArray.push(name);
            this.load.image(name, path);
        }


        // this.sand = this.physics.add.staticGroup({
        //     key: 'sand',
        //     frameQuantity: 20
        // });
        // Phaser.Actions.PlaceOnLine(this.sand.getChildren(),
        //     new Phaser.Geom.Line(20, 580, 820, 580));
        // this.sand.refresh();
        //
        // this.info = this.add.text(10, 10, '',
        //     { font: '24px Arial Bold', fill: '#FBFBAC' });
    }

    update(time: number): void {
        if (!this.grid.isFull()) {
            let chosen = Phaser.Math.RND.pick(this.objectArray);
            this.grid.add(chosen);
        }
        this.grid.
        Phaser.Actions.GridAlign(this.grid.getChildren(), {
            width: 3,
            height: 3,
            cellWidth: this.cameras.main.width/3,
            cellHeight: this.cameras.main.height/3,
            position: Phaser.Display.Align.CENTER,
            x: 100,
            y: 100
        });
        // var diff: number = time - this.lastStarTime;
        // if (diff > this.delta) {
        //     this.lastStarTime = time;
        //     if (this.delta > 500) {
        //         this.delta -= 20;
        //     }
        //     this.emitStar();
        // }
        // this.info.text =
        //     this.starsCaught + " caught - " +
        //     this.starsFallen + " fallen (max 3)";
    }

    private onClick(star: Phaser.Physics.Arcade.Image): () => void {
        return function () {
            star.setTint(0x00ff00);
            star.setVelocity(0, 0);
            this.starsCaught += 1;
            this.time.delayedCall(100, function (star) {
                star.destroy();
            }, [star], this);
        }
    }

    private onFall(star: Phaser.Physics.Arcade.Image): () => void {
        return function () {
            star.setTint(0xff0000);
            this.starsFallen += 1;
            this.time.delayedCall(100, function (star) {
                star.destroy();
                if (this.starsFallen > 2) {
                    this.scene.start("ScoreScene", { starsCaught: this.starsCaught });
                }
            }, [star], this);
        }
    }

    private emitStar(): void {
        var star: Phaser.Physics.Arcade.Image;
        var x = Phaser.Math.Between(25, 775);
        var y = 26;
        star = this.physics.add.image(x, y, "star");

        star.setDisplaySize(50, 50);
        star.setVelocity(0, 200);
        star.setInteractive();

        star.on('pointerdown', this.onClick(star), this);
        //this.physics.add.collider(star, this.objectArray, this.onFall(star), null, this);
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
