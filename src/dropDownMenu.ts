import "phaser";
import {WelcomeScene} from './welcomeScene';

export class DropDownMenu extends Phaser.Scene {
    key: string = "DropDownMenu";
    key_paused_scene: string;
    menuDown: boolean;

    constructor(){
        super({
            key: "dropDownMenu"
        });
    }

    init(/*params: any*/): void {
        this.menuDown = false;
    }

    preload(): void {
        this.load.image("menubutton", "assets/ui/menu_button.png"/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.spritesheet('fullscreenbuttonblack', 'assets/ui/fullscreen_button_black.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fullscreenbuttonwhite', 'assets/ui/fullscreen_button_white.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image("exitbutton", "assets/ui/exit_button.png" /*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image("menubackground", "assets/ui/menu_background.png" /*{ frameWidth: 352, frameHeight: 728 }*/);
    }

    create(): void {
        // Menubackground
        let menuBackground = this.add.image(-115, 110, "menubackground");
        menuBackground.setAngle(-90);
        menuBackground.setOrigin(0, 0);
        menuBackground.setScale(0.15, 0.15);
        menuBackground.setTint(0xeeeeee);

        // ExitButton
        let exitButton = this.add.image(-64, 16+2*(16+64), 'exitbutton');
        exitButton.setOrigin(0, 0);
        exitButton.setScale(0.125, 0.125);
        exitButton.setInteractive();

        exitButton.on('pointerup', function () {
            // Close menu
            this.menuAction(menuButton, fullscreenButton, exitButton, menuBackground);

            this.game.scene.stop(this.key_paused_scene);
            this.game.scene.start("WelcomeScene");
        }, this);

        // Fullscreen Button
        let fullscreenButton = this.add.image(-64, 16+(16+64), 'fullscreenbuttonblack', 0);
        fullscreenButton.setOrigin(0, 0);
        fullscreenButton.setInteractive();

        fullscreenButton.on('pointerup', function () {

            if (this.scale.isFullscreen) {
                fullscreenButton.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                fullscreenButton.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);

        // Enable key F for enabling/disabling fullscreen
        var FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {

            if (this.scale.isFullscreen)
            {
                fullscreenButton.setFrame(0);
                this.scale.stopFullscreen();
            }
            else
            {
                fullscreenButton.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);

        // MenuButton
        let menuButton = this.add.image(16+32, 16+32, 'menubutton');
        menuButton.setScale(0.125, 0.125);
        menuButton.setInteractive();

        menuButton.on('pointerup', () => this.menuAction(menuButton, fullscreenButton, exitButton, menuBackground));

        // StartGame
        this.game.scene.start("WelcomeScene");
    }

    menuAction(menuButton, fullscreenButton, exitButton, menuBackground): void {
        if (this.menuDown) {
            // Resume current scene
            this.game.scene.resume(this.key_paused_scene);

            // Animation
            let menuButtonTween = this.tweens.add({
                targets: menuButton,
                angle: 0,
                ease: 'Cubic',
                duration: 600
            });

            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                y: 110,
                ease: "Cubic",
                duration: 500,
                delay: 100
            });

            let fullscreenButtonTween = this.tweens.add({
                targets: fullscreenButton,
                x: -64,
                ease: "Cubic",
                duration: 300,
                delay: 50
            });

            let exitButtonTween = this.tweens.add({
                targets: exitButton,
                x: -64,
                ease: "Cubic",
                duration: 300
            });

            this.menuDown = false;

        } else {
            // Pause current scene
            // @ts-ignore
            let key_paused_scene = this.game.scene.getScenes(true)[0].key;
            this.game.scene.pause(key_paused_scene);
            this.key_paused_scene = key_paused_scene;

            // Animation
            let menuButtonTween = this.tweens.add({
                targets: menuButton,
                angle: -90,
                ease: 'Cubic',
                duration: 500
            });

            let menuBackgroundTween = this.tweens.add({
                targets: menuBackground,
                y: 270,
                ease: "Cubic",
                duration: 500
            });

            let fullscreenButtonTween = this.tweens.add({
                targets: fullscreenButton,
                x: 16,
                ease: "Cubic",
                duration: 500,
                delay: 50,
            });

            let exitButtonTween = this.tweens.add({
                targets: exitButton,
                x: 16,
                ease: "Cubic",
                duration: 500,
                delay: 100
            });

            this.menuDown = true;
        }
    }
}
