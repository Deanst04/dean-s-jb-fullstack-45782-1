const number = +prompt(`please enter a number`);

function decreaseNumbers(n) {
  for (let i = n; i > 0; i--) {
    document.write(`${i}, `);
  }
}

function decreasePyramid(size) {
  for (let row = size; row > 0; row--) {
    for (let col = row; col > 0; col--) {
      document.write(`${col} `);
    }
    document.write(`<br>`);
  }
}

decreaseNumbers(number);
document.write(`<br>==============<br>`);
decreasePyramid(number);
