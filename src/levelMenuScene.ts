import 'phaser';
import {BaseScene} from './BaseScene';

export class LevelMenuScene extends BaseScene {
    private levelButtons: Phaser.GameObjects.Group;
    private imageSize: number;

    constructor() {
        super('LevelMenuScene');
    }

    init(data): void {
        this.levelButtons = this.add.group();
        this.imageSize = Math.min(this.cameras.main.width/(4+2), this.cameras.main.height/(3+2));
    }

    preload(): void {
        this.load.image('background', 'assets/ui/background1.png');
        this.load.image('catButton', 'assets/ui/cat_button.png');
        this.load.image('levelButton11', 'assets/ui/level11_button.png');
        this.load.image('levelButton12', 'assets/ui/level12_button.png');
        this.load.image('levelButton13', 'assets/ui/level13_button.png');
        this.load.image('levelButton14', 'assets/ui/level14_button.png');
        this.load.image('levelButton21', 'assets/ui/level21_button.png');
        this.load.image('levelButton22', 'assets/ui/level22_button.png');
        this.load.image('levelButton23', 'assets/ui/level23_button.png');
        this.load.image('levelButton24', 'assets/ui/level24_button.png');
        this.load.image('levelButton31', 'assets/ui/level31_button.png');
        this.load.image('levelButton32', 'assets/ui/level32_button.png');
        this.load.image('levelButton33', 'assets/ui/level33_button.png');
        this.load.image('levelButton34', 'assets/ui/level34_button.png');

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transitionIn();

        let background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let catButton = this.add.sprite(20, this.cameras.main.height - 20, 'catButton');
        let levelButton11 = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 1, 'levelButton11');
        let levelButton12 = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 1, 'levelButton12');
        let levelButton13 = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 1, 'levelButton13');
        let levelButton14 = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 1, 'levelButton14');
        let levelButton21 = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 2, 'levelButton21');
        let levelButton22 = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 2, 'levelButton22');
        let levelButton23 = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 2, 'levelButton23');
        let levelButton24 = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 2, 'levelButton24');
        let levelButton31 = this.add.sprite(this.cameras.main.width / 5 * 1, this.cameras.main.height / 4 * 3, 'levelButton31');
        let levelButton32 = this.add.sprite(this.cameras.main.width / 5 * 2, this.cameras.main.height / 4 * 3, 'levelButton32');
        let levelButton33 = this.add.sprite(this.cameras.main.width / 5 * 3, this.cameras.main.height / 4 * 3, 'levelButton33');
        let levelButton34 = this.add.sprite(this.cameras.main.width / 5 * 4, this.cameras.main.height / 4 * 3, 'levelButton34');

        console.log(levelButton34.texture.key);

        this.levelButtons.addMultiple([
            levelButton11,
            levelButton12,
            levelButton13,
            levelButton14,
            levelButton21,
            levelButton22,
            levelButton23,
            levelButton24,
            levelButton31,
            levelButton32,
            levelButton33,
            levelButton34
        ]);

        catButton.setOrigin(0, 1);

        let scaleCatButton = this.imageScalingFactor(this.imageSize/1.5, catButton.width, catButton.height);
        catButton.setScale(scaleCatButton, scaleCatButton);
        catButton.setInteractive();
        catButton.on('pointerdown', function(event) {
            catButton.setTint(0xcccccc);
        }, this);
        catButton.on('pointerup', function(event) {
            catButton.clearTint();
            this.game.scene.start('SortingSceneLoader');
            this.game.scene.stop(this.key);
            return;
        }, this);

        for (let sprite of this.levelButtons.getChildren()) {
            if (sprite instanceof Phaser.GameObjects.Sprite) {
                sprite.setName(sprite.texture.key);
                sprite.setOrigin(0.5, 0.5);

                let scale = this.imageScalingFactor(this.imageSize, sprite.width, sprite.height);
                sprite.setScale(scale, scale);

                sprite.setInteractive();
                sprite.on('pointerdown', function(event) {
                    if (sprite instanceof Phaser.GameObjects.Sprite) {
                        sprite.setTint(0xcccccc);
                    }
                }, this);
            }
        }

        levelButton11.on('pointerup', function(event) {
            if (levelButton11 instanceof Phaser.GameObjects.Sprite) {
                levelButton11.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': false});
            return;
        }, this);

        levelButton12.on('pointerup', function(event) {
            if (levelButton12 instanceof Phaser.GameObjects.Sprite) {
                levelButton12.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': false});
            return;
        }, this);

        levelButton13.on('pointerup', function(event) {
            if (levelButton13 instanceof Phaser.GameObjects.Sprite) {
                levelButton13.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': false});
            return;
        }, this);

        levelButton14.on('pointerup', function(event) {
            if (levelButton14 instanceof Phaser.GameObjects.Sprite) {
                levelButton14.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': false});
            return;
        }, this);

        levelButton21.on('pointerup', function(event) {
            if (levelButton21 instanceof Phaser.GameObjects.Sprite) {
                levelButton21.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 1, 'infinite': true});
            return;
        }, this);

        levelButton22.on('pointerup', function(event) {
            if (levelButton22 instanceof Phaser.GameObjects.Sprite) {
                levelButton22.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 2, 'infinite': true});
            return;
        }, this);

        levelButton23.on('pointerup', function(event) {
            if (levelButton23 instanceof Phaser.GameObjects.Sprite) {
                levelButton23.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 3, 'infinite': true});
            return;
        }, this);

        levelButton24.on('pointerup', function(event) {
            if (levelButton24 instanceof Phaser.GameObjects.Sprite) {
                levelButton24.clearTint();
            }
            this.transitionOut('PropertySortingSceneLoader', {'setCat': 4, 'infinite': true});
            return;
        }, this);

        levelButton31.on('pointerup', function(event) {
            if (levelButton31 instanceof Phaser.GameObjects.Sprite) {
                levelButton31.clearTint();
            }
            console.log("TODO: implement");
            return;
        }, this);

        levelButton32.on('pointerup', function(event) {
            if (levelButton32 instanceof Phaser.GameObjects.Sprite) {
                levelButton32.clearTint();
            }
            console.log("TODO: implement");
            return;
        }, this);

        levelButton33.on('pointerup', function(event) {
            if (levelButton33 instanceof Phaser.GameObjects.Sprite) {
                levelButton33.clearTint();
            }
            this.transitionOut('GameSceneLoader', {'setLevel': 1});
            return;
        }, this);

        levelButton34.on('pointerup', function(event) {
            if (levelButton34 instanceof Phaser.GameObjects.Sprite) {
                levelButton34.clearTint();
            }
            this.transitionOut('GameSceneLoader', {'setLevel': 2});
            return;
        }, this);
    }

    update(time: number): void {

    }
}
