import "phaser";

export class ScoreScene extends Phaser.Scene {
    key: string = "ScoreScene";
    private score: number;
    private result: Phaser.GameObjects.Text;
    private hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "ScoreScene"
        });
    }

    init(data): void {
        this.score = data.score;
    }

    preload(): void {
        this.load.image('gamebackground', 'assets/ui/game_background.png');
    }

    create(): void {
        // MenuUI must be in the front
        this.game.scene.moveDown(this.key);

        let background = this.add.sprite(0, 0, "gamebackground");
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        //background.setTint(0xffccaa);
        //background.setAlpha(0.9);

        let resultText: string = 'Your score is ' + this.score + '!';
        this.result = this.add.text(200, 250, resultText,
            { font: '48px Arial Bold', fill: '#FBFBAC' });

        let hintText: string = "Click to restart";
        this.hint = this.add.text(300, 350, hintText,
            { font: '24px Arial Bold', fill: '#FBFBAC' });

        this.input.on('pointerdown', function (/*pointer*/) {
            this.scene.start("WelcomeScene");
        }, this);
    }

}
