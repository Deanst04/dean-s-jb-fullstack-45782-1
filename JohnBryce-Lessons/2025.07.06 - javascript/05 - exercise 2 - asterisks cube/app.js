const cubeSize = +prompt(`enter size`);

function printRow(width) {
    for (let col = 1; col <= width; col++) {
        document.write(`* `);
    }
}

function drawACube(size) {
    for (let height = 1; height <= size; height++) {
        printRow(size);
        document.write(`<br>`);
    }
}

drawACube(cubeSize);