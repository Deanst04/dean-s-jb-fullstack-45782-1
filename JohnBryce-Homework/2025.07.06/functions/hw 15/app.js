function drawLineOfAsterisks(width) {
  for (let col = 1; col <= width; col++) {
    document.write(`* `)
  }
    document.write(`<br>`);
}

function drawRectangle(width, height) {
  document.write(`<pre>`);
  for (let row = 1; row <= height; row++) {
    if (row === 1 || row === height) drawLineOfAsterisks(width);
    else drawEmptyLine(width);
  }
  document.write(`</pre>`);
}

function drawEmptyLine(width) {
  for (let col = 1; col <= width; col++) {
    if (col === 1 || col === width) {
      document.write(`* `);
    } else document.write(`  `);
  }
  document.write(`<br>`);
}

function drawSeparationLine() {
  document.write(`<br>================<br>`);
}

function getRandomMeasure(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}


drawRectangle(6, 4);
drawSeparationLine();
drawRectangle(getRandomMeasure(1, 20), getRandomMeasure(1, 20));
drawSeparationLine();
drawRectangle(+prompt(`please enter width`), +prompt(`please enter height`));
drawSeparationLine();