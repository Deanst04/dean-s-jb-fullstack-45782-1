const width = +prompt(`please enter a width`);
const height = +prompt(`please enter a height`);
const randomWidth = parseInt(Math.random() * (20) + 1);
const randomHeight = parseInt(Math.random() * (20) + 1);

function boxWidth(w) {
  for (let col = 0; col < w; col++) {
    document.write(`* `);
  }
  document.write(`<br>`);
}

function displayCubeOfAsterisks(w, h) {
  for (let row = 0; row < h; row++) {
    boxWidth(w);
  }
}


displayCubeOfAsterisks(6, 4);
document.write(`<br>===============<br>`);
displayCubeOfAsterisks(randomWidth, randomHeight);
document.write(`<br>===============<br>`);
displayCubeOfAsterisks(width, height);