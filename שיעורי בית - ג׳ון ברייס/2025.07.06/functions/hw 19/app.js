const userNumber = +prompt(`please enter a number`)

function displayLineOfAsterisks(n) {
    for (let count = 1; count <= n; count++) {
        document.write(`* `);
    }
}

function displayUpsideDownPyramidOfAsterisks(size) {
    for (let row = size; row >= 1; row--) {
        displayLineOfAsterisks(row);
        document.write(`<br>`);
    }
}

function displayPyramidOfAsterisks(size) {
    for (let row = 1; row <= size; row++) {
        displayLineOfAsterisks(row);
        document.write(`<br>`);
    }
}

function displayFullShape(size) {
    document.write(`<pre>`);
    displayUpsideDownPyramidOfAsterisks(size);
    displayPyramidOfAsterisks(size);
    document.write(`</pre>`);
}

function announcement(string) {
    document.write(`${string}`);
}

function drawSeparationLine() {
    document.write(`<br>====================<br>`);
}

announcement(`functions: hw 19`);
drawSeparationLine();
displayFullShape(userNumber);