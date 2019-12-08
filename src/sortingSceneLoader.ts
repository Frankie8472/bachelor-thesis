import 'phaser';
import {BaseScene} from './BaseScene';

export class SortingSceneLoader extends BaseScene {

    constructor() {
        super('SortingSceneLoader');
    }

    init(): void {

    }

    preload(): void {
        // Load json file
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.sceneChange('SortingScene', {'jsonObject': this.cache.json.get('objects')});
    }

    update(time: number): void {

    }

}
