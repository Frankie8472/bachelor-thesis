import 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import RenderConfig = Phaser.Types.Core.RenderConfig;
import {PreloadAssets} from './preloadAssets';
import {DropDownMenu} from './dropDownMenu';
import {WelcomeScene} from './welcomeScene';
import {LevelMenuScene} from './levelMenuScene';
import {IntroScene} from './introScene';
import {GameScene} from './gameScene';
import {ScoreScene} from './scoreScene';
import {SortingScene} from './sortingScene';
import {PropertySortingScene} from './propertySortingScene';
import {RestrictedSortingScene} from './restrictedSortingScene';

const renderConfig: RenderConfig = {
    antialias: true,
    pixelArt: false
};

let width: number = window.screen.width;
let height: number = window.screen.height;

if (window.screen.width <= window.screen.height) {
    width = window.screen.height;
    height = window.screen.width;
}

const config: GameConfig = {
    title: 'Gotscha!',
    parent: 'game',
    type: Phaser.AUTO,
    scene: [
        PreloadAssets,
        DropDownMenu, WelcomeScene, LevelMenuScene,
        SortingScene,
        PropertySortingScene,
        RestrictedSortingScene,
        IntroScene, GameScene,
        ScoreScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    backgroundColor: '#000000',

    render: renderConfig,

    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height
    }
};

export class Gotscha extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    const game = new Gotscha(config);
};
