import 'phaser';

export class SortingScene extends Phaser.Scene {
    key: string = 'SortingScene';

    // Our Object with name, imagepath and properties
    private jsonObject: any;

    // Remaining stack  of images
    private arrayStack: Phaser.GameObjects.Container;

    private arrayCategory: Phaser.GameObjects.Group;

    private cardDisplaySize: number;

    constructor() {
        super({
            key: 'SortingScene'
        });
    }

    init(data): void {

        this.jsonObject = data.jsonObject;
        this.arrayStack = this.add.container(0,0);
        this.arrayCategory = this.add.group();
        this.cardDisplaySize = 100;
    }

    preload(): void {

        this.load.image('gamebackground', 'assets/ui/sorting_background.png');

        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');

        // Get Image names from json and save them in array
        for (let image of this.jsonObject['images']) {
            let name = image.name;
            let path = 'assets/geometrical_objects/images/' + name;
            this.load.image(name, path);
        }

        // Get categories
        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }

            let name = cat.name;
            let path = 'assets/geometrical_objects/categories/' + cat.url;
            this.load.image(name, path);

        }

    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        let transition = this.transitionInit();
        this.transitionIn(transition);

        let background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);

        // ================================================================================================
        // Add control bar
        // ================================================================================================

        this.controlBar();

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();


    }

    update(time: number): void {
    }

    // ================================================================================================
    // Control Bar
    // ================================================================================================
    private controlBar(): void {
        let controlbar = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height, "menubackground");
        controlbar.setOrigin(0.5, 0.5);
        controlbar.setAngle(-90);
        controlbar.setScale(0.13,0.24);

        // Category indicator
        let x = this.cameras.main.width/2 - (controlbar.height*0.24)/2;
        let countCategories = 0;

        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }
            countCategories++;
        }

        for (let cat of this.jsonObject['categories']) {
            if (cat.url === null) {
                continue;
            }

            x += (controlbar.height*0.24) / (countCategories + 1);
            let name = cat.name;
            let sprite = this.add.sprite(x, this.cameras.main.height - controlbar.width*0.13/5, name);
            sprite.setName(name);

            // TODO: needed?
            sprite.setData("pushed", false);
            sprite.setData("validElements", cat.validElements);

            sprite.setOrigin(0.5, 0.5);
            sprite.setDisplaySize(64, 64);
            sprite.setVisible(true);

            // TODO: überflüssig?
            this.arrayCategory.add(sprite);

            sprite.setInteractive();

            sprite.on('pointerdown', function(event) {
                for (let item of this.arrayCategory.getChildren()){
                    if (item instanceof Phaser.GameObjects.Sprite){
                        item.clearTint();
                    }
                }

                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.setTintFill(0x8dfd59);
                    this.orderCards(sprite.name, sprite.getData("validElements"));
                }
            }, this);
        }
    }

    // ================================================================================================
    // Card action
    // ================================================================================================
    private loadCards(): void {
        this.arrayStack.setDepth(2);

        for (let image of this.jsonObject['images']) {
            let size = this.cardDisplaySize;

            let name = image.name;
            let cat1 = image.cat1;
            let cat2 = image.cat2;
            let cat3 = image.cat3;
            let cat4 = image.cat4;

            let sprite = this.add.sprite(Phaser.Math.RND.between(100 + size / 2, this.cameras.main.width - size / 2), Phaser.Math.RND.between(size / 2, this.cameras.main.height - 100 - size / 2), name);

            this.arrayStack.add(sprite);

            sprite.setName(name);

            sprite.setData('cat1', cat1);
            sprite.setData('cat2', cat2);
            sprite.setData('cat3', cat3);
            sprite.setData('cat4', cat4);

            sprite.setOrigin(0.5, 0.5);
            sprite.setAngle(Phaser.Math.RND.angle());

            sprite.setVisible(true);

            let scale = this.min(size / sprite.height, size / sprite.width);
            sprite.setScale(scale, scale);
            sprite.setInteractive();

            this.input.setDraggable(sprite);
            this.input.enableDebug(sprite);

            this.input.on('drag', function(pointer, obj, dragX, dragY) {
                obj.setPosition(dragX, dragY);
            });

            sprite.on('pointerdown', function(event) {
                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.setTint(0x999999);
                    this.arrayStack.bringToTop(sprite);
                }
            }, this);

            sprite.on('pointerup', function(event) {
                if (sprite instanceof Phaser.GameObjects.Sprite) {
                    sprite.clearTint();
                }
            }, this);
        }
    }

    private orderCards(catname: string, validElements: string[]):void {
        this.arrayStack.each(function(element){
            if (element instanceof Phaser.GameObjects.Sprite){
                let coords = this.returnQuad(validElements.indexOf(element.getData(catname)));
                element.setX(coords[0]);
                element.setY(coords[1]);
            }
        }, this)
    }

    // ================================================================================================
    // Transition functions
    // ================================================================================================
    private transitionInit(): Phaser.GameObjects.Graphics {
        let circle = this.add.graphics();
        let mask = circle.createGeometryMask();
        let rectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);

        circle.setPosition(this.cameras.main.width/2, this.cameras.main.height/2);
        circle.fillCircle(0, 0, 0.1);

        mask.setInvertAlpha(true);

        rectangle.setDepth(2);
        rectangle.setOrigin(0, 0);
        rectangle.setMask(mask);

        circle.fillCircle(0, 0, 0.1);

        return circle;
    }

    private transitionIn(circle: Phaser.GameObjects.Graphics): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 10*0.5*Math.sqrt(Math.pow(this.cameras.main.width, 2) + Math.pow(this.cameras.main.height, 2)),
            ease: 'linear',
            duration: 700,
        });
    }

    private transitionOut(circle: Phaser.GameObjects.Graphics, scene: string, data?: any): void {
        let tween = this.add.tween({
            targets: circle,
            scale: 0,
            ease: 'linear',
            duration: 700,
            onComplete: () => this.sceneChange(scene, data)
        });
        return;
    }

    private sceneChange(scene: string, data?: any):void {
        this.game.scene.start(scene, data);
        this.game.scene.stop(this.key);
        return;
    }

    // ================================================================================================
    // Helper functions
    // ================================================================================================
    private returnQuad(quad: number): number[] {
        let spritesize = this.cardDisplaySize;
        let ret = null;
        let leftBound = 100 + spritesize/2;
        let rightBound = this.cameras.main.width - spritesize/2;
        let topBound = spritesize/2;
        let botBound = this.cameras.main.height - 100 - spritesize/2;
        let horizontalMid = topBound + (botBound - topBound)/2;
        let verticalMid = leftBound + (rightBound - leftBound)/2;

        /**
         * #########
         * # 0 # 1 #
         * #########
         * # 2 # 3 #
         * #########
         */

        switch(quad) {
            case 0: {
                ret = [Phaser.Math.RND.between(leftBound, verticalMid - spritesize/2), Phaser.Math.RND.between(topBound, horizontalMid-spritesize/2)];
                break;
            }

            case 1: {
                ret = [Phaser.Math.RND.between(verticalMid + spritesize/2, rightBound), Phaser.Math.RND.between(topBound, horizontalMid-spritesize/2)];

                break;
            }

            case 2: {
                ret = [Phaser.Math.RND.between(leftBound, verticalMid - spritesize/2), Phaser.Math.RND.between(horizontalMid+spritesize/2, botBound)];

                break;
            }

            case 3: {
                ret = [Phaser.Math.RND.between(verticalMid + spritesize/2, rightBound), Phaser.Math.RND.between(horizontalMid+spritesize/2, botBound)];
                break;
            }

            default: {
                break;
            }
        }
        return ret;
    }

    private min(val1: number, val2: number): number{
        if (val1 < val2) {
            return val1;
        }
        return val2;
    }

    private max(val1: number, val2: number): number {
        if (val1 > val2) {
            return val1;
        }
        return val2;
    }
}
