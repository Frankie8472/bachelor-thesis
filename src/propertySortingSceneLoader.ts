import "phaser";

export class PropertySortingSceneLoader extends Phaser.Scene {
    key: string = "PropertySortingSceneLoader";
    setCat: number;
    infinite: boolean;

    constructor() {
        super({
            key: "PropertySortingSceneLoader"
        });
    }

    init(data): void {
        this.setCat = data.setCat;
        this.infinite = data.infinite;
    }

    preload(): void {
        // Load json
        this.load.json("objects", "assets/geometrical_objects/geometrical_objects.json");
    }

    create(): void {
        this.game.scene.start("PropertySortingScene", { 'jsonObject': this.cache.json.get("objects"), 'setCat': this.setCat, 'infinite': this.infinite});
        this.game.scene.stop(this.key);
        return;
    }

    update(time: number): void {

    }

}
