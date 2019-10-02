import "phaser";
import {DropDownMenu} from './dropDownMenu';

export class WelcomeScene extends Phaser.Scene {
    key: string = "WelcomeScene";
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    init(): void{

    }

    preload():void{
        this.load.image("background", "assets/ui/background1.png");
        this.load.image("title", "assets/ui/title.png");
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);

        // Add background
        let background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Add title
        let title = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, "title");
        title.setScale(0.7, 0.7);
        title.setInteractive();

        // Scene transition
        title.on("pointerup", function() {
            this.scene.start("GameSceneLoader");
        }, this);
    }
}
