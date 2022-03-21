let scaleZoom = 10

var myGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -scaleZoom,
	minY: -scaleZoom,
	maxX: scaleZoom,
	maxY: scaleZoom,
	unitsPerTick: scaleZoom/5
});


function drawEquation() {
	myGraph.drawEquation(function (x) {
		return equationP(x);
	}, 'green', 3);
	
	myGraph.drawEquation(function (x) {
		return -equationP(x);
	}, 'green', 3);
}

drawEquation()

function equationP(x) {
	let a = -5, b = 15;
	return Math.sqrt((x * x * x) + a * x + b);
}

document.getElementById("pointSVG").addEventListener("wheel", e => {
	console.log(e.deltaY);

	myGraph.context.clearRect(0, 0, 578, 300) // Use var of size instead

	if (e.deltaY < 0) { // Zoom in
		scaleZoom /= 2;
	} else {
		scaleZoom *= 2; // Zoom out
	}

	myGraph = new Graph({
		canvasId: 'myCanvas',
		minX: -scaleZoom,
		minY: -scaleZoom,
		maxX: scaleZoom,
		maxY: scaleZoom,
		unitsPerTick: scaleZoom/5
	});

	drawEquation()
})

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------


document.getElementById('pointSVG').addEventListener('mousemove', e => {
	myGraph.movePoint(e);
});

let operations = document.getElementsByClassName('operation');

function init() {
	for (const input of operations) {
		input.addEventListener('click',  e => {
			let pointsOnGraph = document.getElementsByClassName('workingPoints');
            
			let linesOnGraph = document.getElementsByClassName('linesConnecting');
			let calculatedPoints = document.getElementsByClassName('calculatedPoints');

			for (const buttons of operations) {
				if(buttons.disabled == true) {
					buttons.disabled = false;
				}
			}

			if(pointsOnGraph.length == 2) {
				pointsOnGraph[1].remove()
				pointsOnGraph[0].remove()

				linesOnGraph[1].remove()
				linesOnGraph[0].remove()
			} else if(pointsOnGraph.length == 1) {
				pointsOnGraph[0].remove()
				linesOnGraph[1].remove()
				linesOnGraph[0].remove()
			} 

			if(calculatedPoints.length == 2) {
				calculatedPoints[1].remove();
				calculatedPoints[0].remove();
				linesOnGraph[1].remove()
				linesOnGraph[0].remove()
			} else if(calculatedPoints.length == 1) {
				calculatedPoints[0].remove();
				linesOnGraph[1].remove()
				linesOnGraph[0].remove()
			}
			
			input.disabled = true;
		});
	}
}

init()

document.getElementById('layer2').addEventListener('click', e => {
    let pointsOnGraph = document.getElementsByClassName('workingPoints')

    // Delete the point on the graph that was placed first
	if(operations[0].disabled){
		if(pointsOnGraph.length === 1){
			myGraph.addPointOnClick();
			runOperation(1);   
	
		} else if(pointsOnGraph.length === 0){
			myGraph.addPointOnClick();
	
		} else {
			pointsOnGraph[0].remove();
			myGraph.addPointOnClick();
			runOperation(1);
		}
	} else if (operations[1].disabled) {
		if(pointsOnGraph.length === 0){
			myGraph.addPointOnClick();
			runOperation(2);   

		} else if(pointsOnGraph.length === 1){
			pointsOnGraph[0].remove();
			myGraph.addPointOnClick();
			runOperation(2);
		}
	}
});

function runOperation(operations) {
	switch (operations) {
		case 1:
			pointAddition();
			break;
		case 2:
			myGraph.pointDouble();
			break;
		case 3:
			console.log('Hey Chat!');
			break;
		default:
			console.log('Please no');
			break;
	}
}
