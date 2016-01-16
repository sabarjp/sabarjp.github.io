/**
 * @constructor
 */
function Color(name) {
    this.red = 0;
    this.blue = 0;
    this.green = 0;

    this.name = 'black';

    this.setValuesFromName(name);
}

Color.prototype = {
    getRGBString: function () {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    },

    addValues: function (color) {
        this.red = Math.min(this.red + color.red, 255);
        this.blue = Math.min(this.blue + color.blue, 255);
        this.green = Math.min(this.green + color.green, 255);
    },

    blendValues: function (color) {
        this.red = ~~((this.red + color.red )/ 2);
        this.blue = ~~((this.blue + color.blue) / 2);
        this.green = ~~((this.green + color.green) / 2);
    },

    mixNames: function (color) {
        //same colors
        if (this.name == color.name) {
            this.setValuesFromName(color.name);
        }

        //secondary colors
        else if ((this.name == 'red' && color.name == 'yellow') || (this.name == 'yellow' && color.name == 'red')) {
            this.setValuesFromName('orange');
        } else if ((this.name == 'red' && color.name == 'blue') || (this.name == 'blue' && color.name == 'red')) {
            this.setValuesFromName('violet');
        } else if ((this.name == 'blue' && color.name == 'yellow') || (this.name == 'yellow' && color.name == 'blue')) {
            this.setValuesFromName('green');

        //tertiary colors
        } else if ((this.name == 'yellow' && color.name == 'orange') || (this.name == 'orange' && color.name == 'yellow')) {
            this.setValuesFromName('yellow-orange');
        } else if ((this.name == 'red' && color.name == 'orange') || (this.name == 'orange' && color.name == 'red')) {
            this.setValuesFromName('red-orange');
        } else if ((this.name == 'red' && color.name == 'violet') || (this.name == 'violet' && color.name == 'red')) {
            this.setValuesFromName('red-violet');
        } else if ((this.name == 'blue' && color.name == 'violet') || (this.name == 'violet' && color.name == 'blue')) {
            this.setValuesFromName('blue-violet');
        } else if ((this.name == 'blue' && color.name == 'green') || (this.name == 'green' && color.name == 'blue')) {
            this.setValuesFromName('blue-green');
        } else if ((this.name == 'yellow' && color.name == 'green') || (this.name == 'green' && color.name == 'yellow')) {
            this.setValuesFromName('yellow-green');

        //complementary colors
        } else if ((this.name == 'red' && color.name == 'green') || (this.name == 'green' && color.name == 'red')) {
            this.setValuesFromName('brown');
        } else if ((this.name == 'blue' && color.name == 'orange') || (this.name == 'orange' && color.name == 'blue')) {
            this.setValuesFromName('brown');
        } else if ((this.name == 'yellow' && color.name == 'violet') || (this.name == 'violet' && color.name == 'yellow')) {
            this.setValuesFromName('brown');

        //everything else
        } else {
            this.setValuesFromName('grey');
        }
    },

    setValuesFromName: function (name) {
        this.name = name;

        if (name == 'yellow') {
            this.red = 255;
            this.green = 230;
            this.blue = 40;
        } else if (name == 'yellow-orange') {
            this.red = 255;
            this.green = 187;
            this.blue = 40;
        } else if (name == 'orange') {
            this.red = 255;
            this.green = 137;
            this.blue = 40;
        } else if (name == 'red-orange') {
            this.red = 255;
            this.green = 87;
            this.blue = 40;
        } else if (name == 'red') {
            this.red = 255;
            this.green = 40;
            this.blue = 40;
        } else if (name == 'red-violet') {
            this.red = 255;
            this.green = 40;
            this.blue = 190;
        } else if (name == 'violet') {
            this.red = 180;
            this.green = 40;
            this.blue = 255;
        } else if (name == 'blue-violet') {
            this.red = 105;
            this.green = 40;
            this.blue = 255;
        } else if (name == 'blue') {
            this.red = 40;
            this.green = 40;
            this.blue = 255;
        } else if (name == 'blue-green') {
            this.red = 40;
            this.green = 255;
            this.blue = 180;
        } else if (name == 'green') {
            this.red = 40;
            this.green = 255;
            this.blue = 40;
        } else if (name == 'yellow-green') {
            this.red = 144;
            this.green = 255;
            this.blue = 40;
        } else if (name == 'grey') {
            this.red = 96;
            this.green = 96;
            this.blue = 96;
        } else if (name == 'brown') {
            this.red = 91;
            this.green = 66;
            this.blue = 36;
        }
    }
}