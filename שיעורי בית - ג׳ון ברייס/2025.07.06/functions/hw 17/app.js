const userNumber = +prompt(`please enter a number`)

function displayLineOfAsterisks(n) {
    for (let count = n; count >= 1; count--) {
        document.write(`* `);
    }
}

function displayPyramidOfAsterisks(size) {
    document.write(`<pre>`);
    for (let row = size; row >= 1; row--) {
        displayLineOfAsterisks(row);
        document.write(`<br>`);
    }
    document.write(`</pre>`);
}

function announcement(size) {
    document.write(`this is a an upside down pyramid of ${size}`);
}

function drawSeparationLine() {
    document.write(`<br>====================<br>`);
}

announcement(userNumber);
drawSeparationLine();
displayPyramidOfAsterisks(userNumber);