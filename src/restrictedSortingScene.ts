import 'phaser';
import {BaseScene} from './BaseScene';

export class RestrictedSortingScene extends BaseScene {

    /**
     * Object database with all image names, image paths and image properties
     */
    private jsonObject: any;
    private level: number;
    /**
     * Image groups and containers
     */


    constructor() {
        super('RestrictedSortingScene');
    }

    init(data): void {

        // Data from scene before
        this.jsonObject = data.jsonObject;
        this.level = data.setLevel;
    }

    preload(): void {
        // TODO: Preselect objects
        // TODO: Load objects
        // TODO: Load containers/dropzones
        // TODO: Load Progressbar?
    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transitionIn();

        // TODO: Display objects
        // TODO: Action on objects, drag and drop
        // TODO: Display dropzones
        // TODO: Action on dropzones, placement free + scaling accordingly, check if all objects are placed or simultaniously? how to display failure? rot markieren mit reset button und check button?
        // TODO: level 1 choose one category, level two categories can be mixed
        // TODO: placement in containers 6 4 2? absrpache mit elizabeta
    }

    update(time: number): void {

    }
}

