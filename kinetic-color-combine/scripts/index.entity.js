var entityNextUID = 0;

/**
 * @constructor
 */
function Entity(color, field, x, y) {
    // unique identifier for this entity
    this.uid = entityNextUID++;

    // current state
    this.state = 'IDLE';

    // current animation state
    this.anim = 'IDLE';

    // the color for this entity
    this.color = color;

    // x position in game space for this entity
    this.x = x;

    // y position in game space for this entity
    this.y = y;

    // link back to the field object
    this.field = field;

    this.field.add(this);
}

Entity.prototype = {
    /**
	 * @param {int} x
	 * @param {int} y
	 */
    setPos: function (x, y) {
        this.field.reindexPosition(this, this.x, this.y, x, y);
        this.x = x;
        this.y = y;
        this.field.change(this);
    },

    /**
	 * @param {int} x
	 */
    setX: function (x) {
        this.field.reindexPosition(this, this.x, this.y, x, this.y);
        this.x = x;
        this.field.change(this);
    },

    /**
	 * @param {int} y
	 */
    setY: function (y) {
        this.field.reindexPosition(this, this.x, this.y, this.x, y);
        this.y = y;
        this.field.change(this);
    },

    /**
	 * @param {int} id
	 */
    setId: function (id) {
        this.id = id;
        this.field.change(this);
    },

    /**
	 * @param {bool} mustBeEmpty
	 * @return {object}
	 */
    getAdjacentCoord: function (mustBeEmpty) {
        var potentialCoords = [];

        if (this.x > 0 && (!mustBeEmpty || (mustBeEmpty && this.field.isLocationEmpty(this.x - 1, this.y)))) {
            // west slot is possible
            potentialCoords.push({ 'x': this.x - 1, 'y': this.y });
        }

        if (this.x < this.field.width - 1 && (!mustBeEmpty || (mustBeEmpty && this.field.isLocationEmpty(this.x + 1, this.y)))) {
            // east slot is possible
            potentialCoords.push({ 'x': this.x + 1, 'y': this.y });
        }

        if (this.y > 0 && (!mustBeEmpty || (mustBeEmpty && this.field.isLocationEmpty(this.x, this.y - 1)))) {
            // north slot is possible
            potentialCoords.push({ 'x': this.x, 'y': this.y - 1 });
        }

        if (this.y < this.field.height - 1 && (!mustBeEmpty || (mustBeEmpty && this.field.isLocationEmpty(this.x, this.y + 1)))) {
            // south slot is possible
            potentialCoords.push({ 'x': this.x, 'y': this.y + 1 });
        }

        if (potentialCoords.length == 0) {
            return null;
        }

        return potentialCoords[Math.floor(Math.random() * potentialCoords.length)];
    },

    getNeighborCount: function (entityType) {
        var neighborCount = 0;

        if (this.x > 0 && this.field.doesLocationContainEntityType(this.x - 1, this.y, entityType)) {
            neighborCount++;
        }

        if (this.x < this.field.height - 1 && this.field.doesLocationContainEntityType(this.x + 1, this.y, entityType)) {
            neighborCount++;
        }

        if (this.y > 0 && this.field.doesLocationContainEntityType(this.x, this.y - 1, entityType)) {
            neighborCount++;
        }

        if (this.y < this.field.height - 1 && this.field.doesLocationContainEntityType(this.x, this.y + 1, entityType)) {
            neighborCount++;
        }

        return neighborCount;
    },

    tick: function () {

    },

    onMouseDown: function () {

    },

    dragstart: function (e) {
        this.state = 'DRAG_START';
        this.field.change(this);
    },

    dragend: function (e) {
        var adjustment = this.field.renderer.entitySize;
        var gridCoords = this.field.renderer.getGridFromCoord(e.target.getX() + adjustment, e.target.getY() + adjustment);

        if (this.field.isInBounds(gridCoords) && !(gridCoords.x == this.x && gridCoords.y == this.y)) {
            var entities = this.field.getEntitiesAtPosition(gridCoords.x, gridCoords.y);

            if (entities.length > 0) {
                //space is occupied, excellent
                var otherEntity = this.field.entities[entities[0]];

                this.mergeInto(otherEntity);
            } else {
                //spot is emptyl
                this.state = 'IDLE';
            }
        } else {
            //moved to same space or out-of-bounds
            this.state = 'IDLE';
        }

        this.field.change(this);
    },

    mergeInto: function (target) {
        //merge the objects
        target.color.mixNames(this.color);

        //delete the dragged object
        this.field.remove(this);
        this.state = 'DEAD';
        target.anim = 'MERGE_START'

        this.field.change(target);
    }
}