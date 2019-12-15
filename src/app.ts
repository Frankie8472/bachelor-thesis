import 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import RenderConfig = Phaser.Types.Core.RenderConfig;
import {DropDownMenu} from './dropDownMenu';
import {WelcomeScene} from './welcomeScene';
import {LevelMenuScene} from './levelMenuScene';
import {GameSceneLoader} from './gameSceneLoader';
import {IntroScene} from './introScene';
import {GameScene} from './gameScene';
import {ScoreScene} from './scoreScene';
import {SortingScene} from './sortingScene';
import {SortingSceneLoader} from './sortingSceneLoader';
import {PropertySortingSceneLoader} from './propertySortingSceneLoader';
import {PropertySortingScene} from './propertySortingScene';
import {RestrictedSortingScene} from './restrictedSortingScene';
import {RestrictedSortingSceneLoader} from './restrictedSortingSceneLoader';

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
        DropDownMenu, WelcomeScene, LevelMenuScene,
        IntroScene, GameSceneLoader, GameScene,
        SortingSceneLoader, SortingScene,
        PropertySortingSceneLoader, PropertySortingScene,
        RestrictedSortingSceneLoader, RestrictedSortingScene,
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
