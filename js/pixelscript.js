var mouseDown = false;
var currentx = 400;
var currenty = 300;
var ltArrow = 37;
var upArrow = 38;
var rtArrow = 39;
var dwArrow = 40;
var size = 20;

function keyHit(evt) {
	var canvas = document.getElementById('canvas');
	if (!canvas) return;

	var ctx = canvas.getContext('2d');
	var thisKey;
	if (evt) {
		thisKey = evt.which;
	}
	else {
		thisKey = window.event.keyCode;
	}
	switch(thisKey){
		case ltArrow:
			currentx -= size;
			if(currentx<0){currentx = 0;}
			ctx.fillRect(currentx, currenty, size, size);
			break;
		case rtArrow:
			currentx += size;
			ctx.fillRect(currentx, currenty, size, size);
			break;
		case upArrow:
			currenty -= size;
			if(currenty<0){currenty = 0;}
			ctx.fillRect(currentx, currenty, size, size);
			break;
		case dwArrow:
			currenty += size;
			ctx.fillRect(currentx, currenty, size, size);
			break;
		default:
			break;
	}
}

function resetSize(){
	var newLoc = document.getElementById("size");
	newLoc.blur();
	var newSize = newLoc.options[newLoc.selectedIndex].value;
	size = parseInt(newSize);
}

function makeEqual(){
	var canvas = document.getElementById('canvas');
	if (!canvas) return;
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = $('#colorpicker').val();
}

function resizeCanvas() {
	var canvas = document.getElementById('canvas');
	if (!canvas) return;

	var ctx = canvas.getContext('2d');
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight - $('#header').outerHeight() - 5;
	ctx.fillStyle = $('#colorpicker').val();
}

function convertCanvas() {
	var canvas = document.getElementById('canvas');	
	var img = Canvas2Image.saveAsPNG(canvas, true);

	if (!img) {
		alert("Sorry, this browser is not capable of saving " + strType + " files!");
		return false;
	}

	img.id = "canvasimage";
	canvas.parentNode.replaceChild(img, canvas);
}

$(document).ready(function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	$('#colorpicker').val('#AA3B0C');

	document.onkeydown = keyHit;
	document.getElementById("size").selectedIndex = 1;
	document.getElementById("size").onchange = resetSize;
	
	$('#canvas').on('touchstart mousedown', function(e){
		e.preventDefault();
	    mouseDown = true;
	});

	$(document).on('touchend mouseup', function(e){
		e.preventDefault();
	    mouseDown = false;
	});

	$('#canvas').mousemove(function(e){
	    if(mouseDown == false) return;

	    // Mouse click + moving logic here
		var offsets = $('#canvas').offset();
		currentx = e.pageX - offsets.left;
		currenty = e.pageY - offsets.top;
		currentx = parseInt(currentx/size) * size;
		currenty = parseInt(currenty/size) * size;

		ctx.fillRect(currentx, currenty, size, size);
	});

	$('#canvas').on('touchmove', function(e){
	    if(mouseDown == false) return;

	    // Mouse click + moving logic here
		var offsets = $('#canvas').offset();
		currentx = e.originalEvent.targetTouches[0].pageX - offsets.left;
		currenty = e.originalEvent.targetTouches[0].pageY - offsets.top;
		currentx = parseInt(currentx/size) * size;
		currenty = parseInt(currenty/size) * size;

		ctx.fillRect(currentx, currenty, size, size);
	});

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

	ctx.fillStyle = '#AA3B0C';
	currentx = $('#canvas').width()/2;
	currenty = $('#canvas').height()/2;
	ctx.fillRect(currentx,currenty, 20, 20);

	makeEqual();
	$('#colorpicker').change(makeEqual);

	$('#download').click(function() {
		canvas.toBlob(function(blob) {
		    saveAs(blob, "pixels.png");
		});
	});

	if (!localStorage.pixelUser) {
		localStorage.pixelUser = true;
		$('#welcomeModal').modal('show');
	}
});
	
