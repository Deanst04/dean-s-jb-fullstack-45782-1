const userWidth = +prompt(`please enter width`);
const userHeight = +prompt(`please enter height`);
const randomWidth = parseInt(Math.random() * (10) + 1);
const randomHeight = parseInt(Math.random() * (10) + 1);


function boxLine(w) {
  for (let col = 0; col < w; col++) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function boxEmptyLine(w) {
  for (let col = 0; col < w; col++) {
    if (col === 0 || col === w - 1) {
      document.write(`* `);
    } else {
      document.write(`  `);
    }
  }
  document.write(`<br>`);
}

function displayCubeOfAsterisks(w, h) {
  for (let row = 0; row < h; row++) {
    if (row === 0 || row === h - 1) {
      boxLine(w);
    } else boxEmptyLine(w);
  }
}

document.write(`<pre>`);
displayCubeOfAsterisks(6, 4);
document.write(`<br>=============<br>`);
displayCubeOfAsterisks(randomWidth, randomHeight);
document.write(`<br>=============<br>`);
displayCubeOfAsterisks(userWidth, userHeight);
document.write(`</pre>`);
