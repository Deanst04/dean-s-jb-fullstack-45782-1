const userNumber = +prompt(`please enter a number`)

function displayLineOfAsterisks(n) {
    for (let count = 1; count <= n; count++) {
        document.write(`* `);
    }
}

function displayLineOfNumbers(n) {
    for (let count = 1; count <= n; count++) {
        document.write(`${count} `);
    }
}

function displayPyramidOfAsterisksAndNumbers(size) {
    document.write(`<pre>`);
    for (let row = size; row >= 1; row--) {
        displayLineOfNumbers(row);
        displayLineOfAsterisks(row);
        document.write(`<br>`);
    }
    document.write(`</pre>`);
}

function announcement(string) {
    document.write(`${string}`);
}

function drawSeparationLine() {
    document.write(`<br>====================<br>`);
}

announcement(`functions: hw 18`);
drawSeparationLine();
displayPyramidOfAsterisksAndNumbers(userNumber);