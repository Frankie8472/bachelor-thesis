import 'phaser';
import {BaseScene} from './BaseScene';

export class PropertySortingSceneLoader extends BaseScene {
    /**
     * Category to be sorted
     */
    setCat: number;

    /**
     * Falling/Animated objects?
     */
    infinite: boolean;

    constructor() {
        super('PropertySortingSceneLoader');
    }

    init(data): void {
        // Initialize previous scene data
        this.setCat = data.setCat;
        this.infinite = data.infinite;
    }

    preload(): void {
        // Load json file
        this.load.json('objects', 'assets/geometrical_objects/geometrical_objects.json');
    }

    create(): void {
        this.sceneChange('PropertySortingScene', {
            'jsonObject': this.cache.json.get('objects'),
            'setCat': this.setCat,
            'infinite': this.infinite
        });
    }

    update(time: number): void {

    }

}
