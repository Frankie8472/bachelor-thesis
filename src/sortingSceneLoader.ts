import 'phaser';
import {BaseScene} from './BaseScene';

export class SortingSceneLoader extends BaseScene {
    key: string = 'SortingSceneLoader';

    setLevel: number;

    constructor() {
        super('SortingSceneLoader');
    }

    init(data): void {

    }

    preload(): void {
        // Load json
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.game.scene.start('SortingScene', {'jsonObject': this.cache.json.get('objects')});
        this.game.scene.stop(this.key);
        return;
    }

    update(time: number): void {

    }

}
