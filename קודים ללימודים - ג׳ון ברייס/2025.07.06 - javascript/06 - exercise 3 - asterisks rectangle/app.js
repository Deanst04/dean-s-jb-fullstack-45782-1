const cubeWidth = +prompt(`enter width`);
const cubeHeight = +prompt(`enter height`);

function printRow(length) {
    for (let col = 1; col <= length; col++) {
        document.write(`* `);
    }
}

function printRectangle(width, height) {
    for (let row = 1; row <= height; row++) {
        printRow(width);
        document.write(`<br>`);
    }
}

printRectangle(cubeWidth, cubeHeight);