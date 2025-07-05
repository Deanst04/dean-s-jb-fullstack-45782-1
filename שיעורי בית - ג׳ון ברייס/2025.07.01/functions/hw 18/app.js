const number = +prompt(`please enter a number`);

function lineOfNumbers(end) {
  for (let i = 1; i <= end; i++) {
    document.write(`${i} `);
  }
}

function lineOfAsterisks(count) {
  for (let i = 0; i < count; i++) {
    document.write(`* `);
  }
}

function lineOfNumbersAndAsterisks(row) {
  lineOfNumbers(row);
  lineOfAsterisks(row);
  document.write(`<br>`);
}

function decreasePyramid(n) {
  for (let row = n; row > 0; row--) {
    lineOfNumbersAndAsterisks(row);
  }
}

decreasePyramid(number);
