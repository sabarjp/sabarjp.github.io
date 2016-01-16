$(function () {
	start();
});

function start(canvas) {
    console.log('Starting up');

    console.log('Creating stage using container: "content"');
	var stage = new Kinetic.Stage({
		container: 'content',
		width: 600,
		height: 600
	});
	
    //resize stage as needed
	console.log('Adding resize events');

    /*
	$(window).on('resize', function(){
		if(this.resizeTimeout){
			clearTimeout(this.resizeTimeout);
		}
		
		this.resizeTimeout = setTimeout(function(){
			$(this).trigger('resizeEnd');
		}, 500);
	});
	
	$(window).on('resizeEnd orientationchange', function() {
		//var scaleX = window.innerWidth / stage.getWidth();
	
		stage.setWidth(400);
		stage.setHeight(400);
		
		//reposition elements
		//var images = layer.getChildren();
		
		//for(var i=0; i < images.length; i++){
		//	if (typeof images[i] !== 'undefined'){
		//		images[i].setX(images[i].getX() * scaleX);
		//	}
		//}
		
		//layer.draw();
	});
    */
	
    //game field data
	console.log('Creating field');
	var field = new Field(12, 1);
	
    //renderer data
	console.log('Creating renderer');
	var renderer = new Renderer();
	field.renderer = renderer;

	console.log('Initializing renderer');
	renderer.initialize(stage, field.entities);
	
	//console.log('Creating test entity');
	//var newEntity1 = new Entity(new Color(64, 0, 0), field, 0, 0);
	//var newEntity2 = new Entity(new Color(0, 64, 0), field, 0, 0);
	//newEntity1.setPos(6, 6);
	//newEntity2.setPos(5, 6);
	
	// time of last tick and other tps calc values
	var tickIntervalStart = Date.now();
	var ticksSinceReset = 0;
	var ticksPerSecondTarget = 15;
	
    //main loop
	console.log('Entering main loop');
	var loop = setInterval(function(){
		//we must perform a set amount of ticks per second
		//so that the logic does not depend on the render speed
		if(Date.now() - tickIntervalStart >= 1000){
			if(ticksSinceReset < ticksPerSecondTarget){
				for(var t = 0; t < ticksPerSecondTarget - ticksSinceReset; t++){
				    field.tick();
				}
			}
			
			ticksSinceReset = 0;
			tickIntervalStart = Date.now();
		} else {
		    field.tick();
			ticksSinceReset++;
		}
		
		//render as fast as possible
		renderer.update(field);
		renderer.render();
	}, 15);
}
