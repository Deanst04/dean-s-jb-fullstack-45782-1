const userNumber = +prompt(`please enter a number`)

function displayLineOfNumbers(n) {
    for (let count = n; count >= 1; count--) {
        document.write(`${count} `);
    }
}

function displayPyramidOfNumber(size) {
    for (let row = size; row >= 1; row--) {
        displayLineOfNumbers(row);
        document.write(`<br>`);
    }
}

function drawSeparationLine() {
    document.write(`<br>====================<br>`);
}

displayLineOfNumbers(userNumber);
drawSeparationLine();
displayPyramidOfNumber(userNumber);