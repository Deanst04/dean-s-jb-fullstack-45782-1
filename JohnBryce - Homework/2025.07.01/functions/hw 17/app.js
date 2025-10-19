const number = +prompt(`please enter a number`);

function lineOfAsterisks(n) {
  for (let i = n; i > 0; i--) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function decreasePyramid(n) {
  for (let row = n; row > 0; row--) {
    lineOfAsterisks(row);
  }
}


decreasePyramid(number);
