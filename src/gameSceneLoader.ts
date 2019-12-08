import 'phaser';
import {BaseScene} from './BaseScene';

export class GameSceneLoader extends BaseScene {
    /**
     * Game level
     */
    level: number;

    constructor() {
        super('GameSceneLoader');
    }

    init(data): void {
        // Initialize data from previous scene
        this.level = data.level;
    }

    preload(): void {
        // Load json file
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.sceneChange('GameScene', {'jsonObject': this.cache.json.get('objects'), 'level': this.level});
    }

    update(time: number): void {

    }

}
