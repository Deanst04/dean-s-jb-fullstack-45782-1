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

function drawSeparationLine() {
  document.write(`<br>================<br>`);
}

drawRectangle(6, 4);
drawSeparationLine();
drawRectangle(getRandomMeasure(1, 20), getRandomMeasure(1, 20));
drawSeparationLine();
drawRectangle(+prompt(`enter width`), +prompt(`enter height`));
drawSeparationLine();
