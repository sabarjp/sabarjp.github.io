/**
 * @constructor
 */
function Renderer() {
    // list of image data associated with entity uid
    this.imageData = {}

    // dirty flag
    this.isDirty = true;

    // whether or not to cull the scene - do not enable if using events on images
    this.cullScene = false;

    // time of last draw and other fps calc values
    this.drawIntervalStart = Date.now();
    this.drawsSinceReset = 0;

    // size values
    this.entitySpacing = 60;
    this.entitySize = 20;
}

Renderer.prototype = {
    /**
	 * @param {Stage} stage
	 * @param {object} entityList
	 */
    initialize: function (stage, entityList) {
        this.dirtyLayer = new Kinetic.Layer();

        this.debugLayer = new Kinetic.Layer({
            clearBeforeDraw: true,
            hitGraphEnabled: false
        });

        stage.add(this.dirtyLayer);
        stage.add(this.debugLayer);

        this.fpsCounter = new Kinetic.Text({
            text: 'FPS: ',
            fontSize: 18,
            fontFamily: 'Consolas',
            fill: 'black'
        });

        this.debugLayer.add(this.fpsCounter);
    },

    /**
	 * @param {Field} field
	 */
    update: function (field) {
        var uid;

        // for all data that has changed...
        while ((uid = field.dirtyData.pop()) != null) {
            (function (uid, renderer) {
                var entity = field.entities[uid];

                if (entity != null) {
                    // set size depending on entity color
                    var size = renderer.entitySize;
                    
                    if (entity.color.name == 'red' || entity.color.name == 'yellow' || entity.color.name == 'blue') {
                        size = size;
                    } else if (entity.color.name == 'orange' || entity.color.name == 'violet' || entity.color.name == 'green') {
                        size = ~~(size * 1.25);
                    } else {
                        size = ~~(size * 1.50);
                    }

                    // create image data if it does not exist yet
                    if (!renderer.imageData.hasOwnProperty(uid)) {
                        var shape = new Kinetic.Circle({
                            x: (renderer.entitySpacing * entity.x) + (size),
                            y: (renderer.entitySpacing * entity.y) + (size),
                            radius: size,
                            fill: entity.color.getRGBString(),
                            listening: true,
                            draggable: true
                        });

                        shape.on('dragstart', function (event) {
                            entity.dragstart(event);
                        });

                        shape.on('dragend', function (event) {
                            entity.dragend(event);
                        });

                        if (!renderer.cullScene) {
                            renderer.dirtyLayer.add(shape);
                        }

                        renderer.imageData[uid] = {
                            shape: shape
                        };
                    }

                    var image = renderer.imageData[uid];

                    // update render image
                    image.shape.setFill(entity.color.getRGBString());

                    if (entity.state == 'DRAG_START') {
                        image.shape.opacity(0.5);
                    } else {
                        image.shape.opacity(1.0);
                    }

                    // tween
                    if (entity.anim == 'MERGE_START') {
                        var inflateTween = new Kinetic.Tween({
                            node: image.shape,
                            duration: 0.1,
                            radius: size * 1.2,
                            onFinish: function () {
                                var deflateTween = new Kinetic.Tween({
                                    node: image.shape,
                                    duration: 0.1,
                                    radius: size,
                                    onFinish: function () {
                                        entity.anim = 'IDLE';
                                    }
                                });

                                deflateTween.play();
                            }
                        });


                        setTimeout(function () {
                            entity.anim = 'MERGE_PLAY';
                            inflateTween.play();
                        }, 0);
                    } else if (entity.anim == 'IDLE') {
                        // update render position and size
                        image.shape.position({
                            x: (renderer.entitySpacing * entity.x) + (renderer.entitySpacing / 2),
                            y: (renderer.entitySpacing * entity.y) + (renderer.entitySpacing / 2)
                        });

                        image.shape.setRadius(size);
                    }

                    // re-add shape here if using scene culling
                    if (renderer.cullScene) {
                        renderer.dirtyLayer.add(shape);
                    }

                    renderer.isDirty = true;
                } else {
                    //entity has been destroyed, remove image
                    var image = renderer.imageData[uid];

                    image.shape.remove();
                }
            })(uid, this);
        }
    },

    render: function () {
        if (this.isDirty) {
            var images = this.dirtyLayer.getChildren();

            //console.log('drawing ' + images.length + ' objects')

            // re-draw scene
            this.dirtyLayer.draw();

            // delete shapes from scene when using scene culling - only use if events are detached from the image!
            if (this.cullScene) {
                for (var i = 0; i < images.length; i++) {
                    (function (image) {
                        image.remove();
                    })(images[i]);
                }
            }

            this.isDirty = false;
        }

        this.drawsSinceReset++;

        if (Date.now() - this.drawIntervalStart >= 500) {
            //fps calculation
            var fps = Math.round(500.0 / (Date.now() - this.drawIntervalStart) * this.drawsSinceReset * 2);

            this.fpsCounter.setText('FPS: ' + fps);

            this.debugLayer.draw();

            this.drawIntervalStart = Date.now();

            this.drawsSinceReset = 0;
        }
    },

    getGridFromCoord: function (x, y) {
        var x = ~~(x / this.entitySpacing);
        var y = ~~(y / this.entitySpacing);

        return { x: x, y: y };
    }
}