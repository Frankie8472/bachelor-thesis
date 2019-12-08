import 'phaser';
import {BaseScene} from './BaseScene';

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

    constructor() {
        super('DropDownMenu');
    }

    init(): void {
        // Initialize fields
        this.key_paused_scene = null;
        this.lock = false;
        this.menuDown = false;
        this.buttonSize = 64;
    }

    preload(): void {
        // Load UI
        this.load.image('menubutton', 'assets/ui/menu_button.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.spritesheet('fullscreenbuttonblack', 'assets/ui/fullscreen_button_black.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('exitbutton', 'assets/ui/exit_button.png' /*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png' /*{ frameWidth: 352, frameHeight: 728 }*/);
    }

    create(): void {
        // TODO: find a way to generalize the drop down menu and the tweendata
        this.setMenu();
    }

    update(time: number, delta: number): void {

    }

    /**
     * Function for initializing the menu buttons, background and action
     */
    private setMenu() {
        let scale: number;

        // Menubackground
        const menuBackground: Phaser.GameObjects.Sprite = this.add.sprite(10 + 64 + 25, 100, 'menubackground');
        menuBackground.setOrigin(1, 1);
        menuBackground.setDisplaySize(200, 80 * 5);
        menuBackground.setTint(0xeeeeee);

        // ExitButton
        const exitButton: Phaser.GameObjects.Sprite = this.add.sprite(-64, 10 + 32 + 2 * (10 + 64), 'exitbutton');
        exitButton.setOrigin(0.5, 0.5);

        scale = this.imageScalingFactor(this.buttonSize, exitButton.width, exitButton.height);
        exitButton.setScale(scale, scale);

        exitButton.setInteractive();

        exitButton.on('pointerup', function() {
            // Close menu
            this.menuAction(menuButton, fullscreenButton, exitButton, menuBackground);
            this.game.scene.stop(this.key_paused_scene);
            if (this.key_paused_scene === "LevelMenuScene" || this.key_paused_scene === "WelcomeScene") {
                this.game.scene.start('WelcomeScene');
            } else {
                this.game.scene.start('LevelMenuScene');
            }
        }, this);

        // Fullscreen Button
        const fullscreenButton: Phaser.GameObjects.Sprite = this.add.sprite(-64, 10 + 32 + (10 + 64), 'fullscreenbuttonblack', 0);
        fullscreenButton.setOrigin(0.5, 0.5);

        scale = this.imageScalingFactor(this.buttonSize, fullscreenButton.width, fullscreenButton.height);
        fullscreenButton.setScale(scale, scale);

        fullscreenButton.setInteractive();

        fullscreenButton.on('pointerup', function() {

            if (this.scale.isFullscreen) {
                fullscreenButton.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                fullscreenButton.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);

        // Enable key F for enabling/disabling fullscreen
        const FKey: Phaser.Input.Keyboard.Key = this.input.keyboard.addKey('F');

        FKey.on('down', function() {

            if (this.scale.isFullscreen) {
                fullscreenButton.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                fullscreenButton.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);

        // MenuButton
        const menuButton: Phaser.GameObjects.Sprite = this.add.sprite(32 + 10, 10 + 32, 'menubutton');
        menuButton.setOrigin(0.5, 0.5);

        scale = this.imageScalingFactor(this.buttonSize, menuButton.width, menuButton.height);
        menuButton.setScale(scale, scale);

        menuButton.setInteractive();

        menuButton.on('pointerup', function() {
            if (!this.lock) {
                // Acquire lock
                this.lock = true;
                this.menuAction(menuButton, fullscreenButton, exitButton, menuBackground);
            }

        }, this);

        // StartGame
        this.game.scene.start('WelcomeScene');
    }

    /**
     * Function which defines the graphical behaviour of the drop down menu
     * @param menuButton Button for displaying or hiding the menu
     * @param fullscreenButton Button for entering or leaving fullscreen mode
     * @param exitButton Button to return to the main menu
     * @param menuBackground Graphical background of the menu
     */
    private menuAction(menuButton, fullscreenButton, exitButton, menuBackground): void {
        if (this.menuDown) {
            // Animation
            const menuButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuButton,
                angle: 0,
                ease: 'Cubic',
                duration: 700,
                onComplete: () => this.lock = false,
            });

            const menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuBackground,
                y: 100,
                ease: 'Cubic',
                duration: 500,
                delay: 200
            });

            const fullscreenButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: fullscreenButton,
                x: -64,
                ease: 'Cubic',
                duration: 500,
                delay: 100
            });

            const exitButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: exitButton,
                x: -64,
                ease: 'Cubic',
                duration: 500
            });

            this.menuDown = false;

            // Resume current scene
            this.game.scene.resume(this.key_paused_scene);

        } else {
            // Pause current scene
            // @ts-ignore
            const key_paused_scene: string = this.game.scene.getScenes(true)[0].key;
            this.game.scene.pause(key_paused_scene);
            this.key_paused_scene = key_paused_scene;

            // Animation
            const menuButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuButton,
                angle: -90,
                ease: 'Cubic',
                duration: 700,
                onComplete: () => this.lock = false,
            });

            const menuBackgroundTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: menuBackground,
                y: 3 * (64 + 10) + 30,
                ease: 'Cubic',
                duration: 600
            });

            const fullscreenButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: fullscreenButton,
                x: 10 + 32,
                ease: 'Cubic',
                duration: 500,
                delay: 100,
            });

            const exitButtonTween: Phaser.Tweens.Tween = this.tweens.add({
                targets: exitButton,
                x: 10 + 32,
                ease: 'Cubic',
                duration: 500,
                delay: 200
            });

            this.menuDown = true;
        }
    }
}
