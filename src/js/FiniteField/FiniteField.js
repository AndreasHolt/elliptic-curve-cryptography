import { multiplicativeXOR, additiveXOR, findInverseGF2, aXOR, mXOR } from "./gf2.js";
import {numberOfBits2, Mod} from "./Bits.js";
import {createCurveABCD, createCurveAXY, calcPointAdditionPrime, calcPointAdditionGF2} from "./curves.js";

const canvas = document.getElementById("curveGraph");
let ctx;
if (canvas) {
    ctx = canvas.getContext("2d");
}
//let table = document.querySelector("#table");

let curve;

document.querySelector("#form").addEventListener("submit", (event) => {
    event.preventDefault();
    let prime;
    let power;
    let modoli;
    let additionFunction;
    let createPointsFunction;
    switch (event.target["curveList"].value) {
        case ("Prime 5"):
            prime = 5;
            power = 1;
            modoli = 5;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 17"):
            prime = 17;
            power = 1;
            modoli = 17;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 37"):
            prime = 37;
            power = 1;
            modoli = 37;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 131"):
            prime = 131;
            power = 1;
            modoli = 131;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("GF2 4"):
            prime = 2;
            power = 4;
            modoli = 19;
            additionFunction = calcPointAdditionGF2;
            break;
        case ("GF2 5"):
            prime = 2;
            power = 5;
            modoli = 37;
            additionFunction = calcPointAdditionGF2;
            break;
        case ("GF2 8"):
            prime = 2;
            power = 8;
            modoli = 285;
            additionFunction = calcPointAdditionGF2;
            break;
    }
    //curve = createCurveABCD(2,1,1,1, Math.pow(prime, power), modoli, additionFunction);
    curve = createCurveAXY(Math.floor(Math.random()*Math.pow(prime, power)), 1, 0, Math.pow(prime, power), modoli, additionFunction);


    let optionsList = [{mode:"multiplicative"},{mode:"additive"}];    
    for (let options of optionsList) {
        let arrayValues = createTable(curve.fieldOrder, curve.mod, options);
        createTableHTML(arrayValues, curve.fieldOrder, options.mode);
    }


    //console.log("Subgroup for G: " + curve.calcSubGroup(curve.G));
    console.log("a: " + curve.a);
    curve.createPoints();
    drawPoints(curve.points, curve.fieldOrder);
    /*
    curve.points = [];
    let prime = Number(event.target["prime"].value);
    let power = Number(event.target["power"].value);
    let sizeOfTable = Math.pow(prime, power);
    curve.fieldOrder = sizeOfTable;
    let optionsList = [{mode:"multiplicative"},{mode:"additive"}];
    let modoli;

    if (power > 1) {
        modoli = Number(event.target["modoli"].value);
        //curve.c = 1;
        //curve.d = 1;
    } else {
        modoli = prime;
        curve.c = 0;
        curve.d = 0;
    }
    curve.mod = modoli;
    
    for (let options of optionsList) {
        let arrayValues = createTable(sizeOfTable, modoli, options);
        createTableHTML(arrayValues, sizeOfTable, options.mode);
    }
    
    createPoints(curve, sizeOfTable, modoli);
    curve.drawDots(sizeOfTable);
*/
});
document.getElementById("additionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        let index1 = Number(event.target["index1"].value);
        let index2 = Number(event.target["index2"].value);
        let point1 = curve.points[index1];
        let point2 = curve.points[index2];
        let options = {};
        if (curve.mod === curve.fieldOrder) {
            options.prime = true;
        } else {
            options.prime = false;
        }
        
        let newPoint = curve.calcPointAddition(point1, point2);
        drawPoint(newPoint, curve.fieldOrder, 5, "red");
        drawPoint(point1,curve.fieldOrder, 5, "blue");
        drawPoint(point2,curve.fieldOrder, 5, "yellow");
        //drawLine(0, 16, 0, 1, curve.fieldOrder);
        if (index1 !== index2) {
            //drawLineDirect(point1, point2, 16);
        }
        //drawLineDirectGood(point1, newPoint, options);
    } catch (e) {
        console.log("Error! find selv ud af det!");
        console.log(e);
    }
});

/*document.getElementById("power").addEventListener("input", () => {
    if (document.getElementById("power").value > 1) {
        document.getElementById("modoliDiv").hidden = false;
    } else {
        document.getElementById("modoliDiv").hidden = true;
    }
});*/

document.getElementById("Scalar").addEventListener("input", (event) => {
    let index = Number(document.getElementById("index").value);
    let point = curve.points[index];
    let scale = Number(event.target.value);
    if (point) {

        let scaledPoint = curve.calcPointMultiplication(scale, point);
        highlightPointTimeout(scaledPoint, 1000, curve.fieldOrder);
        
    }
});

document.getElementById("scalarForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let index = Number(event.target["index"].value);
    let point = curve.points[index];
    let scale = Number(event.target["Scalar"].value);
    drawPoint(point, curve.fieldOrder, 5, "blue");
    
    if (point) {
        let scaledPoint = curve.calcPointMultiplication(scale, point);
        drawPoint(scaledPoint, curve.fieldOrder, 5, "red");
        drawLineDirectGood(point, scaledPoint, options);
    }
});

function drawLine (x1, x2, y1, y2, size, color = "black") {
    ctx.beginPath();
    ctx.moveTo(x1 * canvas.width / size, canvas.height - (y1 * canvas.height / size));
    ctx.lineTo(x2 * canvas.width / size, canvas.height - (y2 * canvas.height / size));
    ctx.strokeStyle = color;
    ctx.stroke();
    
    /*if (progress < curve.fieldOrder) {
        setTimeout(() => {drawLine(point1, point3, progress + 0.01)}, 0.1);
        let newPoint = {"x":Mod(point1.x + (progress),curve.fieldOrder), "y":Mod(point1.y+(point3.alfa*progress),curve.fieldOrder)};
        drawPoint(newPoint, curve.fieldOrder, 1, "green");
    }*/
}
function drawLineDirect (point1, point2, delay) {
    let alfa = (point2.y - point1.y)/(point2.x - point1.x);
    drawLineDirect_AUX(alfa, 0, 0.2, point1, delay);
}
function drawLineDirect_AUX (alfa, progress, speed, previousPoint, delay) {
    if (progress < curve.fieldOrder) {
        //console.log("Alfa: " + alfa);
        let newPoint = {"x":Mod(previousPoint.x + speed, curve.fieldOrder), "y":Mod(previousPoint.y+(alfa*speed), curve.fieldOrder)};
        let xDifference = newPoint.x - (previousPoint.x + (speed));
        let xMod = Math.abs(xDifference) > 0.00002;
        let yDifference = newPoint.y - (previousPoint.y + (alfa*speed));
        let yMod = Math.abs(yDifference) > 0.00002;
        if (xMod || yMod) {
            if (xMod && yMod) {
                drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"green");
                drawLine(newPoint.x - (speed), newPoint.x, newPoint.y - (alfa*speed), curve.fieldOrder,"green");
            } else if (xMod) {
                drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, newPoint.y, curve.fieldOrder,"green");
                drawLine(newPoint.x - (speed), newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
            } else {
                drawLine(previousPoint.x, newPoint.x, previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"green");
                drawLine(previousPoint.x, newPoint.x, newPoint.y - (alfa*speed), newPoint.y, curve.fieldOrder,"green");
            }
        } else {
            drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
        }
        //drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
        //drawPoint(newPoint, curve.fieldOrder, 1, "green");
        setTimeout(() => {drawLineDirect_AUX(alfa, progress, speed, newPoint, delay)}, delay);
    }
}

function drawLineDirectGood (point, point3, options) {
    let point1 = {x: point.x, y: point.y};
    let tempPoint = {x: point1.x, y: point1.y};
    let i = 0;

    if (options.prime == false && point3.x != 0) {
        point3.y = additiveXOR(point3.y, point3.x);
    } else if (options.prime == true) {
        point3.y = Mod(curve.fieldOrder - point3.y, curve.fieldOrder);
    }

    while(((tempPoint.x != point3.x) || (tempPoint.y != point3.y)) && i < 100) {
        tempPoint.x += 1;
        tempPoint.y += point3.alfa;

        if (tempPoint.x === curve.fieldOrder && tempPoint.y >= curve.fieldOrder) {
            drawLine(point1.x, (tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa)), point1.y, curve.fieldOrder, curve.fieldOrder);
            point1.x = tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa);
            point1.y = 0;
            drawLine(tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa), curve.fieldOrder, 0, point1.y, curve.fieldOrder);
        } else if (tempPoint.x === curve.fieldOrder) {
            drawLine(point1.x, tempPoint.x, point1.y, tempPoint.y, curve.fieldOrder);
            point1.x = 0;
            point1.y = tempPoint.y;
        } else if (tempPoint.y >= curve.fieldOrder) {
            drawLine(point1.x, (tempPoint.x - (tempPoint.y- curve.fieldOrder) / point3.alfa), point1.y, curve.fieldOrder, curve.fieldOrder);
            point1.x = tempPoint.x - (tempPoint.y - curve.fieldOrder) / point3.alfa;
            point1.y = 0;
        }

        tempPoint.x = Mod(tempPoint.x, curve.fieldOrder);
        tempPoint.y = Mod(tempPoint.y, curve.fieldOrder);

        ++i;
    }

    drawLine(point1.x, tempPoint.x, point1.y, tempPoint.y, curve.fieldOrder);

    if (tempPoint.x === point3.x && tempPoint.y === point3.y) {
        drawLine(tempPoint.x, point3.x, tempPoint.y, Mod(curve.fieldOrder - point3.y, curve.fieldOrder), curve.fieldOrder, "green");
    }
}

function drawPoints (arrayPoints, fieldOrder) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let point of arrayPoints) {
        drawPointElement(point, fieldOrder, 5, "black");
    }
}

function drawPoint (point, size, pointSize, color) {
    //console.log("Hello1");
    ctx.beginPath();
    ctx.arc(point.x * canvas.width / size, canvas.height - (point.y * canvas.height / size), pointSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function highlightPointTimeout (point, time, size) {
    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    let x = point.x * canvas.width / size;
    let y = canvas.height - (point.y * canvas.height / size);
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
    svg.appendChild(circle);
    setTimeout(() => {
        svg.removeChild(circle);
    }, time);
}
function highlightPoint (point, size) {
    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
    circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
    svg.appendChild(circle);
    return circle;
}

function drawPointElement (point, size, pointSize, color) {
    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
    circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
    circle.setAttributeNS(null, 'r', pointSize);
    circle.setAttributeNS(null, 'style', `fill: ${color}; stroke: ${color}; stroke-width: 1px;` );
    svg.appendChild(circle);

    circle.addEventListener("click", () => {
        let output = document.getElementById("pointInfo");
        let index;
        curve.points.forEach((elem, i) => {
            if (elem.x === point.x && elem.y === point.y){
                index = i;
            }
        });
        let string = `Point x: ${point.x}, Point y: ${point.y}, Point index: ${index}`;
        output.textContent = string;
    });
    circle.addEventListener("mouseover", () => {
        highlightPointTimeout(point, 400, curve.fieldOrder);
    });

    
}








function createTableHTML (tableArray, tableSize, htmlID) {
    let oldTable = document.getElementById(htmlID);
    let newTable = document.createElement("table");
    newTable.id = htmlID;

    let headerRow = document.createElement("tr");
    for (let i = -1; i < tableSize; i++) {
        let header = document.createElement("th");
        if (i !== -1) {
            header.textContent = i;
        } else {
            if (htmlID === "multiplicative") {
                header.textContent = "*";
            } else if (htmlID === "additive"){
                header.textContent = "+";
            }
        }
        headerRow.appendChild(header);
    }
    newTable.appendChild(headerRow);

    //For each row
    for (let rowIndex = 0; rowIndex < tableSize; rowIndex++) {
        let row = document.createElement("tr");
        let dataCell = document.createElement("td");
        dataCell.textContent = rowIndex;
        row.appendChild(dataCell);
        for (let i = 0; i < tableSize; i++) {
            let dataCell = document.createElement("td");
            dataCell.textContent = tableArray[i][rowIndex];
            row.appendChild(dataCell);
        }
        newTable.appendChild(row);
    }

    if (oldTable) {
        oldTable.replaceWith(newTable);
    } else {
        document.getElementById("outputTableColumn").after(newTable);
    }

}


function createTable (sizeOfTable, mod, options) {
    let arrayValues = [];
    if (options.mode === "additive") {
        arrayValues = calculateElements(sizeOfTable, mod, additiveXOR);
        
    } else if (options.mode === "multiplicative") {
        arrayValues = calculateElements(sizeOfTable, mod, multiplicativeXOR);
    }
    
    return arrayValues;
}

function calculateElements(size, mod, combinationFunction) {
    let arrayValues = [];
    for (let i = 0; i < size; i++) {
        let column = [];
        for (let j = 0; j < size; j++) {
            column[j] = combinationFunction(i, j, mod);
        }
        arrayValues[i] = column;
    }
    return arrayValues;
}

//SLOW
/*function numberOfBits (val) {
    if (val === 0) {
        return 1;
    }
    let i = 0;
    while (val >> i != 0) {
        i++;
    }
    return i;
}*/




function inversePrime (x, mod) {        //Enhance later (Double and add /// sqaure and multiply)
    let result = x;

    for (let i = 0 ; i < mod - 3 ; ++i) {
        result = Mod(result * x, mod);
    }

    return result;
}



function gcd (val1, val2) {

}

function calcIreduciblePoly (size) {

    
}


function isPrime(val){
    
}



function showTable(arrayValues) {
    console.log(arrayValues);
}

function clmul32(x1, x2, mod) {         //https://www.youtube.com/watch?v=v4HKU_VBbqM
    let result = 0;
    //x2 |= 0;                            //Kun nødvendig hvis der er chance for at input er double
    
    while (x1 !== 0) {
        result ^= x2 * (x1 & -x1);
        x1 &= x1 - 1;
    }

    return result;                      //
}