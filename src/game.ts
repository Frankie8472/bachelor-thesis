import "phaser";
import { GameScene } from "./gameScene";
import GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
    title: "Gotscha!",
    width: 800,
    height: 600,
    parent: "game",
    scene: [GameScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#000033"
};
