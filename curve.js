const firstBox = document.getElementById('curve');
firstBox[2].addEventListener('click', (e) => {
  const firstParameter = document.getElementById('a');
  const secondParameter = document.getElementById('b');

  myGraph.context.clearRect(0, 0, 578, 300); // Use var of size instead

  myGraph = new Graph({
    canvasId: 'myCanvas',
    minX: -scaleZoom,
    minY: -scaleZoom,
    maxX: scaleZoom,
    maxY: scaleZoom,
    parameterA: parseInt(firstParameter.value),
    parameterB: parseInt(secondParameter.value),
    unitsPerTick: scaleZoom / 5,
  });

  deletePoints();
  drawEquation();
});
