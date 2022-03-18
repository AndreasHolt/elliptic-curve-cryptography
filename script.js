/// ----------------------------------------------------------------------
/// Configuration of graph
/// ----------------------------------------------------------------------

function Graph(config) {
	// user defined properties
	this.canvas = document.getElementById(config.canvasId);
	this.minX = config.minX;
	this.minY = config.minY;
	this.maxX = config.maxX;
	this.maxY = config.maxY;
	this.unitsPerTick = config.unitsPerTick;
	this.domRect = this.canvas.getBoundingClientRect();

	// constants
	this.axisColor = '#aaa';
	this.font = '8pt Calibri';
	this.tickSize = 20;

	// relationships
	this.context = this.canvas.getContext('2d');
	this.rangeX = this.maxX - this.minX;
	this.rangeY = this.maxY - this.minY;
	this.unitX = this.canvas.width / this.rangeX;
	this.unitY = this.canvas.height / this.rangeY;
	// this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
	// this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
	this.iteration = (this.maxX - this.minX) / 1000;
	this.scaleX = this.canvas.width / this.rangeX;
	this.scaleY = this.canvas.height / this.rangeY;

	// our settings
	this.pointSize = 4
	this.svgID = "pointSVG"
	this.offsetTop = this.canvas.offsetTop
	this.offsetLeft = this.canvas.offsetLeft
	this.centerY = (Math.abs(this.minY / this.rangeY) * this.canvas.height);
	this.centerX = (Math.abs(this.minX / this.rangeX) * this.canvas.width);


	// draw x and y axis
	this.drawXAxis();
	this.drawYAxis();
}

Graph.prototype.drawXAxis = function () {
	var context = this.context;
	context.save();
	context.beginPath();
	context.moveTo(0, this.centerY);
	context.lineTo(this.canvas.width, this.centerY);
	context.strokeStyle = this.axisColor;
	context.lineWidth = 2;
	context.stroke();

	// draw tick marks
	var xPosIncrement = this.unitsPerTick * this.unitX;
	var xPos, unit;
	context.font = this.font;
	context.textAlign = 'center';
	context.textBaseline = 'top';

	// draw left tick marks
	xPos = this.centerX - xPosIncrement;
	unit = -1 * this.unitsPerTick;
	while (xPos > 0) {
		context.moveTo(xPos, this.centerY - this.tickSize / 2);
		context.lineTo(xPos, this.centerY + this.tickSize / 2);
		context.stroke();
		context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
		unit -= this.unitsPerTick;
		xPos = Math.round(xPos - xPosIncrement);
	}

	// draw right tick marks
	xPos = this.centerX + xPosIncrement;
	unit = this.unitsPerTick;
	while (xPos < this.canvas.width) {
		context.moveTo(xPos, this.centerY - this.tickSize / 2);
		context.lineTo(xPos, this.centerY + this.tickSize / 2);
		context.stroke();
		context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
		unit += this.unitsPerTick;
		xPos = Math.round(xPos + xPosIncrement);
	}
	context.restore();
};

Graph.prototype.drawYAxis = function () {
	var context = this.context;
	context.save();
	context.beginPath();
	context.moveTo(this.centerX, 0);
	context.lineTo(this.centerX, this.canvas.height);
	context.strokeStyle = this.axisColor;
	context.lineWidth = 2;
	context.stroke();

	// draw tick marks
	var yPosIncrement = this.unitsPerTick * this.unitY;
	var yPos, unit;
	context.font = this.font;
	context.textAlign = 'right';
	context.textBaseline = 'middle';

	// draw top tick marks
	yPos = this.centerY - yPosIncrement;
	unit = this.unitsPerTick;
	while (yPos > 0) {
		context.moveTo(this.centerX - this.tickSize / 2, yPos);
		context.lineTo(this.centerX + this.tickSize / 2, yPos);
		context.stroke();
		context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
		unit += this.unitsPerTick;
		yPos = Math.round(yPos - yPosIncrement);
	}

	// draw bottom tick marks
	yPos = this.centerY + yPosIncrement;
	unit = -1 * this.unitsPerTick;
	while (yPos < this.canvas.height) {
		context.moveTo(this.centerX - this.tickSize / 2, yPos);
		context.lineTo(this.centerX + this.tickSize / 2, yPos);
		context.stroke();
		context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
		unit -= this.unitsPerTick;
		yPos = Math.round(yPos + yPosIncrement);
	}
	context.restore();
};

Graph.prototype.drawEquation = function (equation, color, thickness) {
	var context = this.context;
	context.save();
	context.save();
	this.transformContext();

	context.beginPath();
	context.moveTo(this.minX, equation(this.minX));

	let lastX = 0;
	
	for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
		if (isNaN(equation(x))) {
			lastX = x
		}
	}
	
	let realRootMultiplier = 1.01;
	let realRoot = lastX * realRootMultiplier;

	for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
		if (isNaN(equation(x)) && x > realRoot) {
			context.lineTo(x, 0);
		} else {
			context.lineTo(x, equation(x));
		}
	}

	context.restore();
	context.lineJoin = 'round';
	context.lineWidth = thickness;
	context.strokeStyle = color;
	context.stroke();
	context.restore();
};




Graph.prototype.transformContext = function () {
	var context = this.context;

	// move context to center of canvas
	this.context.translate(this.centerX, this.centerY);

	/*
	 * stretch grid to fit the canvas window, and
	 * invert the y scale so that that increments
	 * as you move upwards
	 */
	context.scale(this.scaleX, -this.scaleY);
};


// Defining new graph

var myGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	unitsPerTick: 1
});

var pointGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	unitsPerTick: 1
});

function equationP(x) {
	return Math.sqrt((x * x * x) + 10 * x + 5)
}

myGraph.drawEquation(function (x) {
	return equationP(x);
}, 'green', 3);

myGraph.drawEquation(function (x) {
	return -equationP(x);
}, 'green', 3);

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------

document.getElementById('myCanvas').addEventListener('click', e => {
	myGraph.createPoint(e);
});

document.getElementById('pointSVG').addEventListener('mousemove', e => {
	myGraph.movePoint(e);
});





var pointSize = 10;

myGraph.convertToCoordinates = function (x, y) {
	myGraph.drawCoordinates((x * this.scaleX) + this.centerX, (-y * this.scaleY) + this.centerY);
}


Graph.prototype.createPoint = function (event) {
	var rect = this.domRect;
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	if (y > this.centerY) {
		myGraph.drawCoordinates(x, this.centerY - (-equationP((x/this.scaleX) - 10) * this.scaleY));
	} else {
		myGraph.drawCoordinates(x, this.centerY - (equationP((x/this.scaleX) - 10) * this.scaleY));
	}
};

let point = null;

Graph.prototype.movePoint = function (event) {
	let mousePos = this.mouseToGraph(event.clientX, event.clientY)
	let coords = this.graphToCoords(mousePos.x, mousePos.y)

	if (mousePos.y > this.centerY) {
		moveSection("point", mousePos.x, this.centerY - (-equationP(coords.x) * this.scaleY));
	} else {
		moveSection("point", mousePos.x, this.centerY - (equationP(coords.x) * this.scaleY));
	}
};

Graph.prototype.drawCoordinates = function (x, y) {
	// Draw rectangle
	this.context.beginPath();
	this.context.fillStyle = "magenta";
	this.context.rect(x-(this.pointSize/2), y-(this.pointSize/2), this.pointSize, this.pointSize);
	this.context.fill();

	return this.context;
};

Graph.prototype.mouseToGraph = function(mouseX, mouseY) {
	x = (this.centerX - this.offsetLeft) + mouseX - 10 * this.scaleX;
	y = (this.centerY - this.offsetTop) + mouseY - 10 * this.scaleY;
	return {x, y}
}

Graph.prototype.graphToCoords = function(graphX, graphY) {
	x = (graphX/this.scaleX) - this.rangeX/2
	y = -((graphY/this.scaleY) - this.rangeY/2)

	return {x, y}
}

Graph.prototype.coordsToGraph = function(coordsX, coordsY) {
	x = this.centerX - coordsX
	y = this.centerY - coordsY
	return {x, y}
}

function moveSection(id, x, y) {
    var el = document.getElementById(id);

    if (!y)
        return

    if (el) {
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    }
}

document.getElementById('layer2').addEventListener('click', e => {
    let pointsOnGraph = document.getElementsByClassName('workingPoints')

    // Delete the point on the graph that was placed first
    if(pointsOnGraph.length === 1){
        addPointOnClick()
        calculateThird()


    } else if(pointsOnGraph.length === 0){
        addPointOnClick()

    } else {
        pointsOnGraph[0].remove()
        addPointOnClick()
        calculateThird()
    }
});

let addPointOnClick = function() {
    let point = document.getElementById('point')
    var svgNS = "http://www.w3.org/2000/svg";

     var circle = document.createElementNS(svgNS,'circle');
     circle.setAttribute('fill','red');
     circle.setAttribute('cx', point.getAttribute('cx'));
     circle.setAttribute('cy', point.getAttribute('cy'));
     circle.classList.add('workingPoints')
     circle.setAttribute('r',5);

     var svg = document.querySelector('svg');
     svg.appendChild(circle);
}


let calculateThird = function() {
    let points = document.getElementsByClassName('workingPoints')
    storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')]
    }

    let lambda = ((storePoints.point2[1] - storePoints.point1[1]) / (storePoints.point2[0] - storePoints.point1[0]))
    let thirdX = lambda * lambda  + lambda * 
    

    console.log(storePoints.point1[0])
    console.log('lambda is: ' + lambda)


    

    
    console.log('test')
}



