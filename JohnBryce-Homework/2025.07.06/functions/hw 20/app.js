const userNumber = +prompt(`please enter a number`)

function displayLineOfIncreasingNumbers(n) {
    for (let count = 1; count <= n; count++) {
        document.write(`${count} `);
    }
}

function displayLineOfDecreasingNumbers(n) {
    for (let count = n; count >= 1; count--) {
        document.write(`${count} `);
    }
}

function displaySpaces(size) {
    for (let i = 1; i <= size; i++) {
        document.write(`  `);
    }
}

function displayPyramidWithSpaces(size) {
    document.write(`<pre>`);
    for (let row = 1; row <= size; row++) {
        displaySpaces(size - row);
        displayLineOfIncreasingNumbers(row);
        displayLineOfDecreasingNumbers(row - 1);
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

announcement(`functions: hw 20`);
drawSeparationLine();
displayPyramidWithSpaces(userNumber);