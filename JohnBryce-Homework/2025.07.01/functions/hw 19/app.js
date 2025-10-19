const number = +prompt(`please enter a number`);

function lineOfAsterisks(count) {
  for (let i = count; i > 0; i--) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function reverseLineOfAsterisks(reverseCount) {
  for (let i = 1; i <= reverseCount; i++) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function decreasePyramid(n) {
  for (let row = n; row > 0; row--) {
    lineOfAsterisks(row);
  }
  for (let row = 1; row <= n; row++) {
    reverseLineOfAsterisks(row);
  }
}

decreasePyramid(number);
