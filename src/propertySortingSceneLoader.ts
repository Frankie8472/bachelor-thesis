import 'phaser';
import {BaseScene} from './BaseScene';

export class PropertySortingSceneLoader extends BaseScene {
    setCat: number;
    infinite: boolean;

    constructor() {
        super('PropertySortingSceneLoader');
    }

    init(data): void {
        this.setCat = data.setCat;
        this.infinite = data.infinite;
    }

    preload(): void {
        // Load json
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.game.scene.start('PropertySortingScene', {
            'jsonObject': this.cache.json.get('objects'),
            'setCat': this.setCat,
            'infinite': this.infinite
        });
        this.game.scene.stop(this.key);
        return;
    }

    update(time: number): void {

    }

}
