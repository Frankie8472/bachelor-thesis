import 'phaser';

export class PropertySortingScene extends Phaser.Scene {
    key: string = 'PropertySortingScene';

    // Our Object with name, imagepath and properties
    private jsonObject: any;

    private transition: Phaser.GameObjects.Graphics;

    // Remaining stack  of images
    private arrayStack: Phaser.GameObjects.Container;

    private arrayDropped: Phaser.GameObjects.Group;

    private arrayCategory: Phaser.GameObjects.Group;

    private arrayDropZone: Phaser.GameObjects.Group;

    private cardDisplaySize: number;

    private setCat: number;

    constructor() {
        super({
            key: 'PropertySortingScene'
        });
    }

    init(data): void {

        this.jsonObject = data.jsonObject;
        this.setCat = data.setCat;
        this.arrayStack = this.add.container(0,0);
        this.arrayCategory = this.add.group();
        this.arrayDropped = this.add.group();
        this.arrayDropZone = this.add.group();
        this.cardDisplaySize = 100;
    }

    preload(): void {

        this.load.image('gamebackground', 'assets/ui/sorting_background.png');

        // Helper menu graphics
        this.load.image('help', 'assets/ui/help.png'/*{ frameWidth: 512, frameHeight: 512 }*/);
        this.load.image('menubackground', 'assets/ui/menu_background.png');

        // Wooden basket
        this.load.image('basket', 'assets/ui/wooden_crate.png');

        // Get propertie images
        for (let prop of this.jsonObject['categories'][this.setCat-1].validElements) {
            if (prop.url === null) {
                continue;
            }

            let name = prop.name;
            let path = 'assets/geometrical_objects/images/' + prop.url;
            this.load.image(name, path);

        }
    }

    create(): void {
        // ================================================================================================
        // Bring MenuUI to the front and set background
        // ================================================================================================

        this.game.scene.sendToBack(this.key);

        this.transition = this.transitionInit();
        this.transitionIn(this.transition);

        let background = this.add.sprite(0, 0, 'gamebackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0xffccaa);
        background.setAlpha(0.9);

        // ================================================================================================
        // Initialize cards
        // ================================================================================================

        this.loadCards();

        // ================================================================================================
        // Add baskets
        // ================================================================================================

        this.initBaskets();

        //this.addCardToCrates();

    }

    update(time: number): void {

    }

    // ================================================================================================
    // Add Baskets
    // ================================================================================================

    private initBaskets(): void {
        // For each property add a basket
        // evenly distributed
        // make snap to grid over basket
        // add one element of each prop
        let numberOfProperties = 0;
        let catName = this.jsonObject['categories'][this.setCat-1].name;

        for (let property of this.jsonObject['categories'][this.setCat-1].validElements){
            numberOfProperties++;
        }

        let stepSize = this.cameras.main.width/(numberOfProperties+1);
        let basketSize = this.cardDisplaySize*2;
        let iteration = 1;

        for (let property of this.jsonObject['categories'][this.setCat-1].validElements){
            console.log(iteration);
            // Add basket
            let basket = this.add.sprite(stepSize*iteration, this.cameras.main.height-basketSize/2, "basket");
            basket.setOrigin(0.5, 0.5);

            let imageScalingFactor = this.imageScalingFactor(basketSize, basket.width, basket.height);
            basket.setScale(imageScalingFactor, imageScalingFactor);

            // Add zone around basket
            let zone = this.add.zone(basket.x, basket.y, basket.width*imageScalingFactor, basket.height*imageScalingFactor);
            zone.setOrigin(0.5, 0.5);
            zone.setRectangleDropZone(basket.width*imageScalingFactor, basket.height*imageScalingFactor);
            zone.setData("propertyName", property.name);

            this.arrayDropZone.add(zone);

            iteration++;
        }

        this.input.on('dragstart', function(pointer, gameObject) {
            if (gameObject instanceof Phaser.GameObjects.Sprite) {
                gameObject.setData("x", gameObject.x);
                gameObject.setData("y", gameObject.y);
            }
        });

        this.input.on('drag', function(pointer, obj, dragX, dragY) {
            obj.setPosition(dragX, dragY);
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if (gameObject instanceof Phaser.GameObjects.Sprite){
                if (gameObject.name === dropZone.getData("propertyName")) {
                    gameObject.x = dropZone.x*1.1;
                    gameObject.y = dropZone.y*0.95;
                    let imageScale = this.imageScalingFactor(this.min(dropZone.x, dropZone.y)*0.2, gameObject.width, gameObject.height);
                    gameObject.setScale(imageScale, imageScale);
                    this.arrayDropped.add(gameObject);
                    gameObject.removeInteractive();

                } else {
                    gameObject.x = gameObject.getData("x");
                    gameObject.y = gameObject.getData("y");
                }

                if (this.arrayStack.length === this.arrayDropped.getLength()) {
                    this.transitionOut(this.transition, "ScoreScene", {score: 1});
                }

            }

        }, this);

    }

    // ================================================================================================
    // Card action
    // ================================================================================================
    private loadCards(): void {
        this.arrayStack.setDepth(2);

        for (let propImage of this.jsonObject['categories'][this.setCat-1].validElements) {
            let propImageName = propImage.name;

            // Create 10 of each property
            for (let i = 0; i < 3; i++) {
                // RND size
                let size = Phaser.Math.RND.between(this.cardDisplaySize*0.7, this.cardDisplaySize*1.3);

                let sprite = this.add.sprite(Phaser.Math.RND.between(100 + size / 2, this.cameras.main.width - size / 2), Phaser.Math.RND.between(size / 2, this.cameras.main.height - 100 - size / 2), propImageName);
                this.arrayStack.add(sprite);
                sprite.setName(propImageName);

                sprite.setOrigin(0.5, 0.5);

                // RND spin
                sprite.setAngle(Phaser.Math.RND.angle());

                sprite.setVisible(true);

                let spriteScale = this.imageScalingFactor(size, sprite.width, sprite.height);
                sprite.setScale(spriteScale, spriteScale);

                sprite.setData("originScale", spriteScale);

                sprite.setInteractive();

                this.input.setDraggable(sprite);
                this.input.enableDebug(sprite);

                sprite.on('pointerdown', function(event) {
                    if (sprite instanceof Phaser.GameObjects.Sprite) {
                        sprite.setTint(0x999999);
                        let zoomSpriteScale = this.imageScalingFactor(size*1.5, sprite.width, sprite.height);
                        sprite.setScale(zoomSpriteScale, zoomSpriteScale);
                        this.arrayStack.bringToTop(sprite);
                    }
                }, this);

                sprite.on('pointerup', function(gameObject, dropZone) {
                    console.log(dropZone);
                    if (dropZone === null) {
                        if (gameObject instanceof Phaser.GameObjects.Sprite) {
                            gameObject.setScale(gameObject.getData("originScale"), gameObject.getData("originScale"));
                        }
                        return;
                    }

                    if (sprite instanceof Phaser.GameObjects.Sprite) {
                        sprite.clearTint();
                    }
                }, this);
            }
        }
    }

    private addCardToCrates(): void {
        let counterSet: string[] = [];
        let numberOfProperties = 0;

        for (let property of this.jsonObject['categories'][this.setCat-1].validElements){
            numberOfProperties++;
        }
        for (let card of this.arrayStack.getAll()) {
            if (card instanceof Phaser.GameObjects.Sprite) {
                let cardName = card.name;
                if (!(cardName in counterSet)) {
                    for (let dropZone of this.arrayDropZone.getChildren()) {
                        if (dropZone instanceof Phaser.GameObjects.Zone) {
                            if (dropZone.name === cardName) {
                                card.x = dropZone.x*1.1;
                                card.y = dropZone.y*0.95;
                                let imageScale = this.imageScalingFactor(this.min(dropZone.x, dropZone.y)*0.2, card.width, card.height);
                                card.setScale(imageScale, imageScale);
                                card.disableInteractive();
                            }
                        }
                    }



                    counterSet.push(cardName);
                }

                // Return if every crate has an example
                if (counterSet.length >= numberOfProperties) {
                    return;
                }
            }

        }
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

    private imageScalingFactor(wantedImageSize: number, realImageSizeWidth: number, realImageSizeHeight: number): number {
        return this.min(wantedImageSize/realImageSizeWidth, wantedImageSize/realImageSizeHeight);
    }
}
