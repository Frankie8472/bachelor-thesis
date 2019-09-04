import "phaser";
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";
import GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
    title: "Gotscha!",
    width: 800,
    height: 600,
    parent: "game",
    scene: [WelcomeScene, GameScene, ScoreScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#18216D",

    scale: {
        parent:'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600

    }
};

export class Gotscha extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
};

window.onload = () => {
    var game = new Gotscha(config);
};
