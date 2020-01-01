import 'phaser';
import {BaseScene} from './baseScene';

export class DropDownMenu extends BaseScene {

    /**
     * Name of the paused scene
     */
    private key_paused_scene: string;

    /**
     * Lock for not messing up animations by clicking repeatedly without waiting for the animation to finish
     */
    private lock: boolean;

    /**
     * State of the drop down menu
     */
    private menuDown: boolean;

    /**
     * Size of the menu buttons
     */
    private buttonSize: number;

    /**
     * Menu button
     */
    private menuButton: Phaser.GameObjects.Sprite;

    /**
     * Exit button
     */
    private exitButton: Phaser.GameObjects.Sprite;

    /**
     * Fullscreen switch
     */
    private fullscreenButton: Phaser.GameObjects.Sprite;

    /**
     * Menu background
     */
    private menuBackground: Phaser.GameObjects.Sprite;

    /**
     * Pause background
     */
    private pauseBackground: Phaser.GameObjects.Container;

    constructor() {
        super('DropDownMenu');
    }

    init(): void {
        // Initialize fields
        this.pauseBackground = this.add.container(0, 0);
        this.key_paused_scene = null;
        this.lock = false;
        this.menuDown = false;
        this.buttonSize = 64;
    }

    preload(): void {

    }

    create(): void {
        this.setPixelScreen();
        this.setMenu();
        this.initInput();
    }

    update(time: number, delta: number): void {

    }

    /**
     * Method for initializing the menu buttons, background and action
     */
    private setMenu(): void {
        let scale: number;

        // Menubackground
        this.menuBackground = this.add.sprite(10 + 64 + 25, 100, 'menubackground');
        this.menuBackground.setOrigin(1, 1);
        this.menuBackground.setDisplaySize(200, 80 * 5);
        this.menuBackground.setTint(0xeeeeee);

        // ExitButton
        this.exitButton = this.add.sprite(-64, 10 + 32 + 2 * (10 + 64), 'exitbutton');
        this.exitButton.setOrigin(0.5, 0.5);
        this.exitButton.setName("exitButton");
        this.exitButton.setData('clicked', false);

        scale = this.imageScalingFactor(this.buttonSize, this.exitButton.width, this.exitButton.height);
        this.exitButton.setScale(scale, scale);

        this.exitButton.setInteractive({cursor: 'pointer'});

        // Fullscreen Button
        this.fullscreenButton = this.add.sprite(-64, 10 + 32 + (10 + 64), 'fullscreenbuttonblack', 0);
        this.fullscreenButton.setOrigin(0.5, 0.5);

        scale = this.imageScalingFactor(this.buttonSize, this.fullscreenButton.width, this.fullscreenButton.height);
        this.fullscreenButton.setScale(scale, scale);

        this.fullscreenButton.setName("fullscreenButton");
        this.fullscreenButton.setData('clicked', false);

        this.fullscreenButton.setInteractive({cursor: 'pointer'});

        // Enable key F for enabling/disabling fullscreen
        const FKey: Phaser.Input.Keyboard.Key = this.input.keyboard.addKey('F');
        FKey.on('down', function () {
            this.scale.toggleFullscreen();
            if (this.scale.isFullscreen) {
                this.fullscreenButton.setFrame(0);
            } else {
                this.fullscreenButton.setFrame(1);
            }

        }, this);

        // MenuButton
        this.menuButton = this.add.sprite(32 + 10, 10 + 32, 'menubutton');
        this.menuButton.setOrigin(0.5, 0.5);

        scale = this.imageScalingFactor(this.buttonSize, this.menuButton.width, this.menuButton.height);
        this.menuButton.setScale(scale, scale);

        this.menuButton.setName("menuButton");
        this.menuButton.setData('clicked', false);

        this.menuButton.setInteractive({cursor: 'pointer'});

        // StartGame
        this.game.scene.start('WelcomeScene');
    }

    /**
     * Method for initializing all input
     */
    private initInput(): void {
        this.input.on('pointerdown', function (pointer, currentlyOver) {
            const gameObject: any = currentlyOver[0];
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setData('clicked', true);
            }
        }, this);

        this.input.on('pointerup', function (pointer, currentlyOver) {
            const gameObject: any = currentlyOver[0];
            if (gameObject instanceof Phaser.GameObjects.Sprite && gameObject.getData('clicked')) {
                this.buttonFunction(gameObject);
            }

            this.menuButton.setData("clicked", false);
            this.exitButton.setData("clicked", false);
            this.fullscreenButton.setData("clicked", false);

        }, this);
    }

    /**
     * Method for assigning each button an event function
     * @param gameObject GameObject on which you want the function on
     */
    private buttonFunction(gameObject: Phaser.GameObjects.Sprite): void {
        switch (gameObject.name) {
            case 'menuButton': {
                if (!this.lock) {
                    // Acquire lock
                    this.lock = true;
                    this.menuAction();
                }
                break;
            }

            case 'fullscreenButton': {
                this.scale.toggleFullscreen();

                if (this.scale.isFullscreen) {
                    gameObject.setFrame(0);
                } else {
                    gameObject.setFrame(1);
                }
                break;
            }

            case 'exitButton': {
                this.menuAction();

                this.game.scene.getScenes(false).forEach(function (scene) {
                    // @ts-ignore
                    const sceneKey: string = scene.key;
                    if (!(sceneKey === this.getKey()) && (this.game.scene.isActive(sceneKey) || this.game.scene.isPaused(sceneKey))) {
                        scene.sound.stopAll();
                        this.game.scene.stop(sceneKey);
                    }
                }, this);

                if (this.key_paused_scene === 'LevelMenuScene' || this.key_paused_scene === 'WelcomeScene') {
                    this.game.scene.start('WelcomeScene');
                } else {
                    this.game.scene.start('LevelMenuScene');
                }
                break;
            }

            default: {
                break;
            }
        }
    }

    /**
     * Method which defines the graphical behaviour of the drop down menu
     */
    private menuAction(): void {

        if (this.menuDown) {
            // Animation
            const menuButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.menuButton,
                angle: 0,
                ease: 'Cubic',
                duration: 700,
                onComplete: () => this.lock = false
            });

            const menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.menuBackground,
                y: 100,
                ease: 'Cubic',
                duration: 500,
                delay: 200
            });

            const fullscreenButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.fullscreenButton,
                x: -64,
                ease: 'Cubic',
                duration: 500,
                delay: 100
            });

            const exitButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.exitButton,
                x: -64,
                ease: 'Cubic',
                duration: 500
            });

            const pixelScreenTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.pauseBackground.getAll(),
                alpha: 0,
                ease: 'linear',
                duration: 700,
                delay: 0,
                onComplete: () => this.pauseBackground.setVisible(false)
            });

            this.menuDown = false;

            // Resume current scene
            this.game.scene.resume(this.key_paused_scene);

        } else {
            // Pause current scene
            this.sound.add('pause').play();

            // @ts-ignore
            const key_paused_scene: string = this.game.scene.getScenes(true)[0].key;
            this.game.scene.pause(key_paused_scene);
            this.key_paused_scene = key_paused_scene;

            // Animation
            const menuButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.menuButton,
                angle: -90,
                ease: 'Cubic',
                duration: 700,
                onComplete: () => this.lock = false,
            });

            const menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.menuBackground,
                y: 3 * (64 + 10) + 30,
                ease: 'Cubic',
                duration: 600
            });

            const fullscreenButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.fullscreenButton,
                x: 10 + 32,
                ease: 'Cubic',
                duration: 500,
                delay: 100,
            });

            const exitButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.exitButton,
                x: 10 + 32,
                ease: 'Cubic',
                duration: 500,
                delay: 200
            });

            this.pauseBackground.setVisible(true);

            const pixelScreenTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: this.pauseBackground.getAll(),
                alpha: 0.9,
                ease: 'linear',
                duration: 700,
                delay: 0
            });

            this.menuDown = true;
        }
    }

    /**
     * Method for setting the pixeled overlay and the hourglass
     */
    private setPixelScreen(): void {
        const pixelScreen: Phaser.GameObjects.Grid = this.add.grid(0, 0, this.cameras.main.width, this.cameras.main.height, this.cameras.main.width / 100, this.cameras.main.width / 100);
        pixelScreen.setOrigin(0, 0);
        pixelScreen.setFillStyle(0x777777);
        pixelScreen.setAltFillStyle(0x555555);
        pixelScreen.setOutlineStyle(0x555555);
        pixelScreen.setAlpha(0);
        this.pauseBackground.add(pixelScreen);

        const hourglass: Phaser.GameObjects.Sprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'hourglass');
        hourglass.setOrigin(0.5, 0.5);

        const clockScale: number = this.imageScalingFactor(3 / 5 * this.cameras.main.height, hourglass.width, hourglass.height);
        hourglass.setScale(clockScale, clockScale);
        hourglass.setAlpha(0);

        this.pauseBackground.add(hourglass);

        this.pauseBackground.setVisible(false);
        this.children.sendToBack(this.pauseBackground);
    }
}
