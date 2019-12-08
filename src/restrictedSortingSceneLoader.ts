import 'phaser';
import {BaseScene} from './BaseScene';

export class RestrictedSortingSceneLoader extends BaseScene {
    /**
     * Game level
     */
    level: number;

    constructor() {
        super('RestrictedSortingSceneLoader');
    }

    init(data): void {
        // Initialize previous scene data
        this.level = data.level;
    }

    preload(): void {
        // Load json file
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.sceneChange('RestrictedSortingScene', {'jsonObject': this.cache.json.get('objects'), 'setLevel': this.level});
    }

    update(time: number): void {

    }

}
