function drawLineOfAsterisks(size) {
  for (let col = 1; col <= size; col++) {
    document.write(`* `);
  }
}

function drawCube(size) {
  for (let row = 1; row <= size; row++) {
    drawLineOfAsterisks(size);
    document.write(`<br>`);
  }
}

drawCube(+prompt(`please enter a size`));
