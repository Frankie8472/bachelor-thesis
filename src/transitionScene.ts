import "phaser";

export class TransitionScene extends Phaser.Scene {
    key: string = "TransitionScene";

    // Fading IN: 0, Fading OUT: 1;
    private fading: boolean;

    constructor() {
        super({
            key: "TransitionScene"
        });
    }

    init(data): void{
        //this.fading = data.fading;
    }

    preload():void{

    }

    create(): void {
        // MenuUI must be in the front
        //this.game.scene.sendToBack(this.key);

        // Scene Transition
        let rectangle = this.add.rectangle(this.cameras.main.width/2, this.cameras.main.height/2,this.cameras.main.width-200, this.cameras.main.height, 0x0000ff);
        let circle = this.add.circle(this.cameras.main.width/2, this.cameras.main.height/2, 0);

        //circle.setBlendMode(Phaser.BlendModes.ERASE);

        let tween = this.add.tween({
            targets: circle,
            radius: 600,
            ease: 'Linear',
            duration: 10000
        });

        //this.scene.stop(this.key);
    }

}
