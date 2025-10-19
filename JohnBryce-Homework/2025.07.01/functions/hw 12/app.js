const number = +prompt(`please enter a number`);

function lineOfAsterisks(n) {
  for (let col = 0; col < n; col++) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function displayCubeOfAsterisks(n) {
  for (let row = 0; row < n; row++) {
    lineOfAsterisks(n)
  }
}

displayCubeOfAsterisks(number);