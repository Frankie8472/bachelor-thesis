import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import RenderConfig = Phaser.Types.Core.RenderConfig;
import { DropDownMenu } from './dropDownMenu';
import { WelcomeScene } from './welcomeScene';
import { LevelMenuScene } from './levelMenuScene';
import { GameSceneLoader } from './gameSceneLoader';
import { GameScene } from './gameScene';
import { ScoreScene } from './scoreScene';

const renderConfig: RenderConfig = {
    antialias: true,
    pixelArt: false
};

const config: GameConfig = {
    title: "Gotscha!",
    parent: "game",
    scene: [DropDownMenu, WelcomeScene, LevelMenuScene, GameSceneLoader, GameScene, ScoreScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#000000",

    render: renderConfig,

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
    let game = new Gotscha(config);
};
