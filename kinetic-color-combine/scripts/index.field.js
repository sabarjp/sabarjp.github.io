/**
 * @constructor
 */
function Field(width, height) {
    // the height of the field, in squares
    this.height = height;

    // the width of the field, in squares
    this.width = width;

    // list of entities associated by their uid
    this.entities = {};

    // 2d array of entity UIDs associated by their position
    this.entityUIDsByPosition = createArray(width, height);

    for (var i = 0; i < this.entityUIDsByPosition.length; i++) {
        for (var j = 0; j < this.entityUIDsByPosition[i].length; j++) {
            (function (i, j, field) {
                // initialize list
                field.entityUIDsByPosition[i][j] = [];
            })(i, j, this);
        }
    }

    // list of entity uids that have been changed
    this.dirtyData = [];

    // reference to the renderer
    this.renderer;
}

Field.prototype = {
    /**
	 * @param {Entity} entity
	 */
    add: function (entity) {
        this.entities[entity.uid] = entity;
        this.entityUIDsByPosition[entity.x][entity.y].push(entity.uid);
        this.change(entity);
    },

    /**
	 * @param {Entity} entity
	 */
    remove: function (entity) {
        delete this.entities[entity.uid];

        var index = this.entityUIDsByPosition[entity.x][entity.y].indexOf(entity);

        this.entityUIDsByPosition[entity.x][entity.y].splice(index, 1);
        this.change(entity);
    },

    /**
	 * @param {Entity} entity
	 */
    change: function (entity) {
        if (this.dirtyData.indexOf(entity.uid) == -1) {
            this.dirtyData.push(entity.uid);
        }
    },

    /**
	 * @param {Entity} entity
	 * @param {int} oldX
	 * @param {int} oldY
	 * @param {int} newX
	 * @param {int} newY
	 */
    reindexPosition: function (entity, oldX, oldY, newX, newY) {
        if (oldX == newX && oldY == newY) {
            return;
        }

        var oldLocEntities = this.entityUIDsByPosition[oldX][oldY];
        var newLocEntities = this.entityUIDsByPosition[newX][newY];

        var oldNdx = oldLocEntities.indexOf(entity.uid);
        var newNdx = newLocEntities.indexOf(entity.uid);

        if (oldNdx != -1) {
            // remove old index
            oldLocEntities.splice(oldNdx, 1);

            // add new index
            if (newNdx == -1) {
                this.entityUIDsByPosition[newX][newY].push(entity.uid);
            }
        }
    },

    /**
	 * @param {int} x
	 * @param {int} y
	 @ @return {bool}
	 */
    isLocationEmpty: function (x, y) {
        var entityListAtPos = this.entityUIDsByPosition[x][y];

        if (entityListAtPos.length > 0) {
            return false;
        }

        return true;
    },

    /**
	 * @param {int} x
	 * @param {int} y
	 @ @return {array}
	 */
    getEntitiesAtPosition: function (x, y) {
        var entityListAtPos = this.entityUIDsByPosition[x][y];

        return entityListAtPos;
    },

    /**
	 * @param {int} x
	 * @param {int} y
	 * @param {int} entityType
	 @ @return {bool}
	 */
    doesLocationContainEntityType: function (x, y, entityType) {
        var entityListAtPos = this.entityUIDsByPosition[x][y];

        if (entityListAtPos.length == 0) {
            return false;
        }

        for (var i = 0; i < entityListAtPos.length; i++) {
            if (this.entities[entityListAtPos[i]].color == entityType) {
                return true;
            }
        }

        return false;
    },

    tick: function () {
        //tick self
        if (Math.random() < 0.01) {
            var nx = Helpers.getRandomInt(0, this.width);
            var ny = Helpers.getRandomInt(0, this.height);

            if (this.isLocationEmpty(nx, ny)) {
                this.createRandomEntity(nx, ny);
            }
        }

        //tick entities
        for (var uid in this.entities) {
            if (this.entities.hasOwnProperty(uid)) {
                var entity = this.entities[uid];

                entity.tick();
            }
        }
    },

    createRandomEntity: function (x, y) {
        var num = Math.random();
        var randomColorName;

        if (num < 0.33333) {
            randomColorName = 'yellow';
        } else if (num < 0.66666) {
            randomColorName = 'red';
        } else {
            randomColorName = 'blue';
        }

        var newEntity = new Entity(new Color(randomColorName), this, x, y);
    },

    isInBounds: function (coords) {
        return coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height;
    }
}