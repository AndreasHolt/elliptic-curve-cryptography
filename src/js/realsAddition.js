import { graphToCoords, addCalculatedPoint } from './graphHelpers';
import { pointDouble } from './realsDoubling';

function listPoints(myGraph, placedPoints, calculatedX, calculatedY, operation) {
    const pObj = graphToCoords(myGraph, placedPoints.point1[0], placedPoints.point1[1]);
    const P = `${Math.round(pObj.x * 100) / 100}, ${Math.round(-pObj.y * 100) / 100}`;

    let Q;
    let qObj;
    if (operation === 'addition') {
        qObj = graphToCoords(myGraph, placedPoints.point2[0], placedPoints.point2[1]);
        Q = `${Math.round(qObj.x * 100) / 100}, ${Math.round(-qObj.y * 100) / 100}`;
    }

    const minusR = `${Math.round(calculatedX * 100) / 100}, ${Math.round(-calculatedY * 100) / 100}`;
    const R = `${Math.round(calculatedX * 100) / 100}, ${Math.round(calculatedY * 100) / 100}`;

    const pointsListed = document.getElementById('pointsListed');

    if (operation === 'addition') {
        const pqObjArr = [pObj, qObj];
        pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(Q = (${Q})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
        // eslint-disable-next-line no-undef
        MathJax.typeset();
        return pqObjArr;
    }
    pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
    // eslint-disable-next-line no-undef
    MathJax.typeset();
    return pObj;
}

function pointAdditionSteps(myGraph, points, lambdaI, x, y) {
    points.forEach((point) => {
        // eslint-disable-next-line no-param-reassign
        point.x = Math.round(point.x * 100) / 100;
        // eslint-disable-next-line no-param-reassign
        point.y = Math.round(point.y * 100) / 100;
    });

    // TODO Why do we use * 100 round and then /100 is it to remove decimals?
    // If so we should use Number.toFixed
    const lambda = Math.round(lambdaI * 100) / 100;
    const newX = Math.round(x * 100) / 100;
    const newY = Math.round(y * 100) / 100;

    const stepRows = document.getElementsByClassName('steps');
    stepRows[0].innerHTML = `If P and Q are distinct \\((x_P \\neq x_Q)\\), the line through them has slope: <br>
                            \\(m = \\frac{y_P - y_Q}{x_P - x_Q} = \\frac{${points[0].y} - ${points[1].y}}{${points[0].x} - ${points[1].x}} = \\underline{${lambda}}\\)`;

    stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point \\(R = (x_R, y_R):\\) <br>
                            \\(x_R = m^2 - x_P - x_Q = ${lambda}^2 - ${points[0].x} - ${points[1].x} = \\underline{${newX}}\\) <br>
                            \\(y_R = y_P + m(x_R - x_P) = ${points[0].y} + ${lambda}(${newX} - ${points[0].x}) = \\underline{${newY}}\\) <br> <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\)`;

    // eslint-disable-next-line no-undef
    MathJax.typeset();

    addCalculatedPoint(myGraph, newX, newY, 1);
}

function calculateAddition(myGraph, point1, point2) {
    const lambda = ((point2[1] - point1[1]) / (point2[0] - point1[0]));
    let newX = (lambda * lambda) - point2[0] - point1[0];
    let newY = 0;

    
    // Handle edge case: same x coordinate for both points, but not same y coordinate
    if (point2[0] === point1[0] && point1[1] !== point2[1]) {
        newY = 9999999; // TODO find javascript value for this
        newX = point1[0];
        return [newX, newY];
    } if (point2[0] === point1[0] && point1[1] === point2[1]) {
        pointDouble(myGraph); // Handle edge case: both points are the same, so double the point

        // TODO: pointDoublingSteps when implemented
    } else {
        newY = point2[1] + lambda * newX + lambda * (-point2[0]);
        return [newX, newY];
    }

    console.log('test');
    return 0;
}

function pointAddition(myGraph) {
    const points = document.getElementsByClassName('workingPoints');

    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')],
    };
    const x1 = (storePoints.point1[0] - myGraph.centerX) / myGraph.scaleX;
    const y1 = (storePoints.point1[1] - myGraph.centerY) / myGraph.scaleY;
    const x2 = (storePoints.point2[0] - myGraph.centerX) / myGraph.scaleX;
    const y2 = (storePoints.point2[1] - myGraph.centerY) / myGraph.scaleY;

    const lambda = ((y2 - y1) / (x2 - x1));
    const point1Arr = [x1, y1];
    const point2Arr = [x2, y2];

    const thirdPoint = calculateAddition(myGraph, point1Arr, point2Arr);

    const listedPoints = listPoints(myGraph, storePoints, thirdPoint[0], thirdPoint[1], 'addition');
    pointAdditionSteps(myGraph, listedPoints, lambda, thirdPoint[0], thirdPoint[1]);

    addCalculatedPoint(myGraph, thirdPoint[0], thirdPoint[1], 1);
}

export { pointAddition, listPoints, pointAdditionSteps };
