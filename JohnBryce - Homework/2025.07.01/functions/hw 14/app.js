const howMany = +prompt(
  `please tell us how many times you want to display random cubes`
);

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

function displayMultipleCubes(count) {
  for (let i = 0; i < count; i++) {
    const randomWidth = parseInt(Math.random() * 20 + 1);
    const randomHeight = parseInt(Math.random() * 20 + 1);
    displayCubeOfAsterisks(randomWidth, randomHeight);
    document.write(`<br>=================<br>`);
  }
}

displayMultipleCubes(howMany);
