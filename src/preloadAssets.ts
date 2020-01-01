import 'phaser';
import {BaseScene} from './BaseScene';

export class PreloadAssets extends BaseScene {

    constructor() {
        super('PreloadAssets');
    }

    init(): void {

    }

    preload(): void {
        this.load.setPath('assets/geometrical_objects/');
        this.load.json('objects', 'geometrical_objects.json');

        this.load.setPath('assets/ui/');
        this.load.image('cogwheel', 'cogwheel.png');
        this.load.image('background1', 'background1.png');
    }

    create(): void {
        this.setBackground();
        this.preLoadImages();
        this.preLoadAudio();
        this.initLoadingGraphics();
        this.start();
    }

    /**
     * Method for preloading all asset images
     */
    private preLoadImages(): void {
        // Load category and object images
        const jsonObject: any = this.cache.json.get('objects');

        for (let category of jsonObject['categories']) {
            this.load.setPath('assets/geometrical_objects/categories/');
            this.load.image(category['name'], category['url']);

            this.load.setPath('assets/geometrical_objects/images/');
            for (let property of category['validElements']) {
                for (let url of property['urls']) {
                    this.load.image(url, url);
                }
            }
        }

        for (let image of jsonObject['images']) {
            this.load.image(image['name'], image['name']);
        }

        // Load UI images
        this.load.setPath('assets/ui/');
        //this.load.image('background1', 'background1.png');
        this.load.image('background2', 'background2.png');
        this.load.image('background3', 'background3.png');
        this.load.image('background4', 'background4.png');
        this.load.image('background5', 'background5.png');

        this.load.image('menubackground', 'menu_background.png');

        this.load.spritesheet('fullscreenbuttonblack', 'fullscreen_button_black.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('menubutton', 'menu_button.png');
        this.load.image('help', 'help.png');
        this.load.image('exitbutton', 'exit_button.png');
        this.load.image('replay', 'reload_button.png');
        this.load.image('erase', 'erase_button.png');
        this.load.image('return', 'return_button.png');

        this.load.image('star_0', 'star_0.png');
        this.load.image('star_1', 'star_1.png');
        this.load.image('star_2', 'star_2.png');
        this.load.image('star_3', 'star_3.png');

        this.load.image('timefluid', 'timefluid.png');
        this.load.image('gamefluid', 'gamefluid.png');
        this.load.image('progressstar', 'star.png');
        this.load.image('progressbar', 'progressbar.png');
        this.load.image('progressbarGreen', 'progressbar_green.png');
        this.load.image('progressbarRed', 'progressbar_red.png');
        this.load.image('plus', 'plus.png');
        this.load.image('minus', 'minus.png');


        this.load.image('hourglass', 'hourglass.png');
        this.load.image('finger', 'finger.png');


        this.load.image('crate', 'crate_topview.png');
        this.load.image('wooden_crate', 'wooden_crate.png');

        this.load.image('title', 'title.png');

        this.load.image('catButton', 'cat_button.png');
        this.load.image('levelButton11', 'level11_button.png');
        this.load.image('levelButton12', 'level12_button.png');
        this.load.image('levelButton13', 'level13_button.png');
        this.load.image('levelButton14', 'level14_button.png');
        this.load.image('levelButton21', 'level21_button.png');
        this.load.image('levelButton22', 'level22_button.png');
        this.load.image('levelButton23', 'level23_button.png');
        this.load.image('levelButton24', 'level24_button.png');
        this.load.image('levelButton31', 'level31_button.png');
        this.load.image('levelButton32', 'level32_button.png');
        this.load.image('levelButton33', 'level33_button.png');
        this.load.image('levelButton34', 'level34_button.png');

        this.load.setPath('assets/introduction/');
        this.load.image('intro_sorting', 'intro_sorting.gif');

    }

    /**
     * Method for preloading all audiofiles
     */
    private preLoadAudio(): void {
        this.load.setPath('assets/ui_audio/');
        this.load.audio('back', 'back.mp3');
        this.load.audio('battle', 'battle.mp3');
        this.load.audio('exploration', 'exploration.mp3');
        this.load.audio('fun', 'fun.mp3');
        this.load.audio('loading', 'loading.mp3');
        this.load.audio('lose', 'lose.mp3');
        this.load.audio('pause', 'pause.mp3');
        this.load.audio('select', 'select.mp3');
        this.load.audio('space', 'space.mp3');
        this.load.audio('sparkle', 'sparkle.mp3');
        this.load.audio('welcome', 'welcome.mp3');
        this.load.audio('win', 'win.mp3');
    }

    /**
     * Method for initializing the loading graphics/animation
     */
    private initLoadingGraphics(): void {
        // Loading graphics
        const cogwheel: Phaser.GameObjects.Sprite = this.add.sprite(1/2*this.cameras.main.width, 1/3*this.cameras.main.height, 'cogwheel');
        cogwheel.setOrigin(0.5, 0.5);
        const scale: number = this.imageScalingFactor(1/3*Math.min(this.cameras.main.height, this.cameras.main.width), cogwheel.width, cogwheel.height);
        cogwheel.setScale(scale, scale);

        const cogTween: Phaser.Tweens.Tween = this.tweens.add({
            targets: cogwheel,
            angle: 360,
            ease: 'Linear',
            repeat: -1,
            duration: 5000
        });

        // Progress bar
        const progress = this.add.graphics();

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(20, 4/5*this.cameras.main.height, (this.cameras.main.width - 40) * value, 1/10*this.cameras.main.height);
        }, this);
    }

    /**
     * Method for initializing the loading and action on completion
     */
    private start(): void {
        this.load.on('complete', function(){
            this.sceneChange('DropDownMenu');
        }, this);

        this.load.start();
    }

    /**
     * Method for initializing the background
     */
    private setBackground(): void {
        let background = this.add.sprite(0, 0, 'background1');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setAlpha(0.3);
    }
}
