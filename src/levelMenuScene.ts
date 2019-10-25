import 'phaser';

export class LevelMenuScene extends Phaser.Scene {
    key: string = 'LevelMenuScene';


    constructor() {
        super({
            key: 'LevelMenuScene'
        });
    }

    init(data): void {

    }

    preload(): void {
        this.load.image("background", "assets/ui/background1.png");
        this.load.image("levelOneButton", "assets/ui/level1_button.png");
        this.load.image("levelTwoButton", "assets/ui/level2_button.png");
        this.load.image("levelThreeButton", "assets/ui/level3_button.png");

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.moveDown(this.key);

        let background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let levelOneButton = this.add.sprite(this.cameras.main.width/10*2, this.cameras.main.height/2, "levelOneButton");
        let levelTwoButton = this.add.sprite(this.cameras.main.width/10*5, this.cameras.main.height/2, "levelTwoButton");
        let levelThreeButton = this.add.sprite(this.cameras.main.width/10*8, this.cameras.main.height/2, "levelThreeButton");

        levelOneButton.setOrigin(0.5, 0.5);
        levelTwoButton.setOrigin(0.5, 0.5);
        levelThreeButton.setOrigin(0.5, 0.5);

        levelOneButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);
        levelTwoButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);
        levelThreeButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);

        levelOneButton.setInteractive();
        levelTwoButton.setInteractive();
        levelThreeButton.setInteractive();

        levelOneButton.on('pointerdown', function(event) {
            levelOneButton.setTint(0xcccccc);
        }, this);
        levelOneButton.on('pointerup', function(event) {
            levelOneButton.clearTint();
            this.game.scene.start("GameSceneLoader");
            this.game.scene.stop(this.key);
            return;
        }, this);

        levelTwoButton.on('pointerdown', function(event) {
            levelTwoButton.setTint(0xcccccc);
        }, this);
        levelTwoButton.on('pointerup', function(event) {
            levelTwoButton.clearTint();
            this.game.scene.start("GameSceneLoader");
            this.game.scene.stop(this.key);
            return;
        }, this);

        levelThreeButton.on('pointerdown', function(event) {
            levelThreeButton.setTint(0xcccccc);
        }, this);
        levelThreeButton.on('pointerup', function(event) {
            levelThreeButton.clearTint();
            this.game.scene.start("GameSceneLoader");
            this.game.scene.stop(this.key);
            return;
        }, this);
    }

    update(time: number): void {

    }
}
