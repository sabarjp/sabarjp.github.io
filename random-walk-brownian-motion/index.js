var dataset = {
    data: [],
    min: 9999999,
    max: 0
}

function draw(){
    var canvas = document.getElementById('chart');
    var context = canvas.getContext('2d');

    if (!canvas.getContext){
        console.log('Canvas not supported!');
        return;
    }

    var width = canvas.width;
    var height = canvas.height;
    var padding = 25;

    var ctx = canvas.getContext('2d');

    // clear image
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // draw chart axes
    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // draw chart data
    var data = dataset.data;

    var granularity = parseInt(document.getElementById('granularity').value);
    var xAxisSpacing = ((canvas.width - (padding * 2) * 1.0) / ((data.length-1) / granularity));
    var i;

    for(i=1, j=0; i<data.length; i = i + granularity, j++){
        if(data[i] > data[i - granularity]){
            ctx.strokeStyle = '#00aa00';
        } else {
            ctx.strokeStyle = '#aa0000';
        }

        ctx.beginPath();

        ctx.moveTo(padding + (xAxisSpacing * j), 
            (height - padding) - linearInterpolate(data[i-granularity], dataset.min, dataset.max, 0, height - (padding * 2)));

        ctx.lineTo(padding + (xAxisSpacing * (j + 1)), 
            (height - padding) - linearInterpolate(data[i], dataset.min, dataset.max, 0, height - (padding * 2)));

        ctx.stroke();
    }
}

function generateNewData(mean, standardDeviation){
    dataset.data = [mean];
    dataset.min = mean;
    dataset.max = mean;

    var i;
    var lastValue = mean;

    for(i=0; i<9999; i++){
        lastValue = getGaussianRandomValue(lastValue, standardDeviation);
        dataset.data.push(lastValue);

        if(lastValue < dataset.min){ dataset.min = lastValue; }
        if(lastValue > dataset.max){ dataset.max = lastValue; }
    }
}

function initialize(){
    generateNewData(100, 8);

    draw();
}

function linearInterpolate(x, x1, x2, y1, y2){
    var f = (x - x1) / (x2 - x1);
    var y = (y1 * (1.0 - f) + (y2 * f));

    return y;
}

function getGaussianRandomValue(mean, standardDeviation){
    return mean + (gaussianRandom() * standardDeviation);
}

function gaussianRandom() {
    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u*u + v*v;

    if(r === 0 || r > 1){
        return gaussianRandom();
    }

    var c = Math.sqrt(-2 * Math.log(r) / r);
    return u * c;
}

