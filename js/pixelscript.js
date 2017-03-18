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

function isMobile() {
	return /Mobi/.test(navigator.userAgent);
}

function resizeCanvas() {
	var canvas = document.getElementById('canvas');
	if (!canvas) return;

	var mobile = isMobile();
	var ctx = canvas.getContext('2d');
    canvas.width = mobile ? window.outerWidth: window.innerWidth;
    canvas.height = (mobile ? window.outerHeight: window.innerHeight) - $('#header').outerHeight() - 5;
    clean();
	ctx.fillStyle = $('#colorpicker').val();
	state = [];
}

function convertCanvas() {
	var canvas = document.getElementById('canvas');	
	var img = Canvas2Image.saveAsJPEG(canvas, true);

	if (!img) {
		alert("Sorry, this browser is not capable of saving " + strType + " files!");
		return false;
	}

	img.id = "canvasimage";
	canvas.parentNode.replaceChild(img, canvas);
}

var state = [];

function getTouchCoord(e) {
    var offsets = $('#canvas').offset();
	var currentx, currenty;
	currentx = e.originalEvent.targetTouches[0].pageX - offsets.left;
	currenty = e.originalEvent.targetTouches[0].pageY - offsets.top;
	currentx = parseInt(currentx/size) * size;
	currenty = parseInt(currenty/size) * size;
	return [currentx, currenty];
}

function getMouseCoords(e) {
	var offsets = $('#canvas').offset();
	var currentx, currenty;
	currentx = e.pageX - offsets.left;
	currenty = e.pageY - offsets.top;
	currentx = parseInt(currentx/size) * size;
	currenty = parseInt(currenty/size) * size;
	return [currentx, currenty];
}

function clean() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width, canvas.height);
}

function updateUI() {
	// if (state.length == 0) {
	// 	$('#undo').prop('disabled', true);
	// } else {
	// 	$('#undo').prop('disbled', false);
	// }
}

function redraw() {
	clean();
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	for (var i=0; i<state.length; i++) {
		size = state[i][0];
		ctx.fillStyle = state[i][1];
		for (var j=2; j<state[i].length; j+=2) {
			ctx.fillRect(state[i][j], state[i][j+1], size, size);
		}
	}

	ctx.fillStyle = $('#colorpicker').val();
}

function updateState(tempstate, coords) {
    tempstate.push(coords[0]);
    tempstate.push(coords[1]);
	currentx = coords[0];
	currenty = coords[1];
}

$(document).ready(function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	$('#colorpicker').val('#AA3B0C');

	document.onkeydown = keyHit;
	document.getElementById("size").selectedIndex = 1;
	document.getElementById("size").onchange = resetSize;
	
	var tempstate = [];

	$('#canvas').on('touchstart', function(e){
		e.preventDefault();
	    mouseDown = true;
	    tempstate = [];
	    tempstate.push(size);
	    tempstate.push($('#colorpicker').val());
	    var coords = getTouchCoords(e);
	    updateState(tempstate, coords);
		ctx.fillRect(coords[0], coords[1], size, size);	
	});

	$('#canvas').mousedown(function(e){
		e.preventDefault();
		console.log(e);
		mouseDown = true;
	    tempstate = [];
	    tempstate.push(size);
	    tempstate.push($('#colorpicker').val());
	    var coords = getMouseCoords(e);
	    updateState(tempstate, coords);
		ctx.fillRect(coords[0], coords[1], size, size);	    
	});

	$(document).on('touchend mouseup', function(e){
		mouseDown = false;
		if (tempstate.length > 0) {
			state.push(tempstate);
			tempstate = [];
		}
	});

	$('#canvas').mousemove(function(e){
	    if(mouseDown == false) return;

	    var coords = getMouseCoords(e);
	    if (coords[0] == currentx && coords[1] == currenty) return;
	    updateState(tempstate, coords);
		ctx.fillRect(coords[0], coords[1], size, size);
	});

	$('#canvas').on('touchmove', function(e){
	    if(mouseDown == false) return;

	    // Mouse click + moving logic here
	    var coords = getTouchCoords(e);
	    if (coords[0] == currentx && coords[1] == currenty) return;
	    updateState(tempstate, coords);
		ctx.fillRect(coords[0], coords[1], size, size);
	});

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

	ctx.fillStyle = '#AA3B0C';
	currentx = $('#canvas').width()/2;
	currenty = $('#canvas').height()/2;
	ctx.fillRect(currentx,currenty, 20, 20);
	state.push([size, ctx.fillStyle, currentx, currenty]);

	makeEqual();
	$('#colorpicker').change(makeEqual);

	$('#download').click(function(e) {
		e.preventDefault();
		canvas.toBlob(function(blob) {
		    saveAs(blob, "pixels.jpg");
		},'image/jpeg', 0.95);
	});

	$('#undo').click(function(e) {
		e.preventDefault();
		if (state.length > 0) {
			state.pop();
			redraw();
			updateUI();
		}
	});

	if (!localStorage.pixelUser) {
		localStorage.pixelUser = true;
		$('#welcomeModal').modal('show');
	}
});
	
