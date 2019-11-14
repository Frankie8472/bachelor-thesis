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
        this.load.image("catButton", 'assets/ui/cat_button.png');
        this.load.image("levelOneButton", "assets/ui/level1_button.png");
        this.load.image("levelTwoButton", "assets/ui/level2_button.png");
        this.load.image("levelThreeButton", "assets/ui/level3_button.png");

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        let transition = this.transitionInit();
        this.transitionIn(transition);

        let background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let catButton = this.add.sprite(this.cameras.main.width/10*5, this.cameras.main.height/10*3, "catButton");
        let levelOneButton = this.add.sprite(this.cameras.main.width/10*2, this.cameras.main.height/10*7, "levelOneButton");
        let levelTwoButton = this.add.sprite(this.cameras.main.width/10*5, this.cameras.main.height/10*7, "levelTwoButton");
        let levelThreeButton = this.add.sprite(this.cameras.main.width/10*8, this.cameras.main.height/10*7, "levelThreeButton");

        catButton.setOrigin(0.5, 0.5);
        levelOneButton.setOrigin(0.5, 0.5);
        levelTwoButton.setOrigin(0.5, 0.5);
        levelThreeButton.setOrigin(0.5, 0.5);

        catButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);
        levelOneButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);
        levelTwoButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);
        levelThreeButton.setDisplaySize(this.cameras.main.height/3, this.cameras.main.height/3);

        catButton.setInteractive();
        levelOneButton.setInteractive();
        levelTwoButton.setInteractive();
        levelThreeButton.setInteractive();

        catButton.on('pointerdown', function(event) {
            catButton.setTint(0xcccccc);
        }, this);
        catButton.on('pointerup', function(event) {
            catButton.clearTint();
            this.game.scene.start("SortingSceneLoader");
            this.game.scene.stop(this.key);
            return;
        }, this);

        levelOneButton.on('pointerdown', function(event) {
            levelOneButton.setTint(0xcccccc);
        }, this);
        levelOneButton.on('pointerup', function(event) {
            levelOneButton.clearTint();
            this.transitionOut(transition, "PropertySortingSceneLoader", {'setCat': 2 });
            return;
        }, this);

        levelTwoButton.on('pointerdown', function(event) {
            levelTwoButton.setTint(0xcccccc);
        }, this);
        levelTwoButton.on('pointerup', function(event) {
            levelTwoButton.clearTint();
            this.transitionOut(transition, "GameSceneLoader", {'setLevel': 2 });
            return;
        }, this);

        levelThreeButton.on('pointerdown', function(event) {
            levelThreeButton.setTint(0xcccccc);
        }, this);
        levelThreeButton.on('pointerup', function(event) {
            levelThreeButton.clearTint();
            this.transitionOut(transition, "GameSceneLoader", {'setLevel': 3 });
            return;
        }, this);
    }

    update(time: number): void {

    }

    private transitionInit(): Phaser.GameObjects.Graphics {
        let circle = this.add.graphics();
        let mask = circle.createGeometryMask();
        let rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);

        circle.setPosition(this.cameras.main.width/2, this.cameras.main.height/2);
        circle.fillCircle(0, 0, 0.1);

        mask.setInvertAlpha(true);

        rectangle.setDepth(2);
        rectangle.setOrigin(0, 0);
        rectangle.setMask(mask);

        circle.fillCircle(0, 0, 0.1);

        return circle;
    }

    private transitionIn(circle: Phaser.GameObjects.Graphics): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 10*0.5*Math.sqrt(Math.pow(this.cameras.main.width, 2) + Math.pow(this.cameras.main.height, 2)),
            ease: 'linear',
            duration: 700,
        });
    }

    private transitionOut(circle: Phaser.GameObjects.Graphics, scene: string, data?: any): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 0,
            ease: 'linear',
            duration: 700,
            onComplete: () => this.sceneChange(scene, data)
        });
        return;
    }

    private sceneChange(scene: string, data?: any):void {
        this.game.scene.start(scene, data);
        this.game.scene.stop(this.key);
        return;
    }
}
