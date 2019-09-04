import "phaser";

export class WelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;
    menuGroup: any;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    init(): void{
        }

    preload():void{
        this.load.image("menubutton", "assets/menu_button.png");
        this.load.image("resetgame", "assets/menu_button.png");
        this.load.image("thankyou", "assets/menu_button.png");
    }

    create(): void {
        let titleText: string = "Gotscha";

        this.title = this.add.text(150, 200, titleText,
            {font: '128px Arial Bold', fill: '#FBFBAC'});

        let hintText: string = "Click to start";
        this.hint = this.add.text(300, 350, hintText,
            {font: '24px Arial Bold', fill: '#FBFBAC'});

        this.input.on('pointerdown', function(/*pointer*/) {
            //this.scene.start("GameScene");
        }, this);

        this.menuGroup = this.add.group();
        let menuButton = this.add.image(this.cameras.main.originX+30, this.cameras.main.originY+30, "menubutton");
        menuButton.setScale(0.1, 0.1);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => this.toggleMenu(menuButton));

        this.menuGroup.add(menuButton);

        let resetGame = this.add.image(this.cameras.main.centerX / 2, this.cameras.main.centerY + 50, "resetgame");
        resetGame.setScale(0.1, 0.1);
        resetGame.setInteractive();

        resetGame.on('pointerup', function() {

            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
                // On stop fulll screen
            } else {
                this.scale.startFullscreen();
                // On start fulll screen
            }
        }, this);

        this.menuGroup.add(resetGame);
        let thankYou = this.add.image(this.cameras.main.centerX / 2, this.cameras.main.centerY + 130, "thankyou");
        thankYou.setScale(0.1, 0.1);
        this.menuGroup.add(thankYou);

    }

    private toggleMenu (button: Phaser.GameObjects.Image): void {
        if (this.menuGroup.y == 0) {
            let menuTween = this.add.tween(this.menuGroup);
            let bounceOut = this.tweens.add({
                targets: button,
                alpha: {from: -180, to: 0},
                ease: Phaser.Math.Easing.Bounce.Out,
                duration: 500
            });
            //menuTween.setStateFromEnd({y: -180}, Phaser.Math.Easing.Bounce.Out, 500, True);
            //menuTween.setStateFromStart(bounceOut, );
            //to({y: -180}, 500, Phaser.Math.Easing.Bounce.Out, true);
        }
        if (this.menuGroup.y == -180) {
            //let menuTween = this.add.tween(this.menuGroup).to({
            //    y: 0
            //}, 500, Phaser.Math.Easing.Bounce.Out, true);
        }
    }

}
