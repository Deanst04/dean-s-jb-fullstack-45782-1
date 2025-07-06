function drawLineOfAsterisks(width) {
  for (let col = 1; col <= width; col++) {
    document.write(`* `);
  }
}

function drawRectangle(width, height) {
  for (let row = 1; row <= height; row++) {
    drawLineOfAsterisks(width);
    document.write(`<br>`);
  }
}

function getRandomMeasure(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function drawNAmountOfRectangles(count) {
  for (let n = 1; n <= count; n++) {
    drawRectangle(getRandomMeasure(1, 20), getRandomMeasure(1, 20));
    drawSeparationLine();
  }
}

function drawSeparationLine() {
  document.write(`<br>================<br>`);
}

drawNAmountOfRectangles(+prompt(`please tell us how many random cubes you want to display`));
