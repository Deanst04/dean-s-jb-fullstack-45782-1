function getNumber() {
  return +prompt(`enter a number between 1 - 5`);
}

function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function displayEmoji(number) {
  if (number === 1) return document.write(`:-)`);
  else if (number === 2) return document.write(`:-(`);
  else if (number === 3) return document.write(`:-/`);
  else if (number === 4) return document.write(`;-)`);
  else if (number === 5) return document.write(`;-(`);
  else return document.write(`invalid number`);
}

function displayAllEmojis() {
  for (let i = 1; i <= 5; i++) {
    displayEmoji(i);
    document.write(`<br>`);
  }
}

function show100RandomEmojis() {
  for (let i = 1; i <= 100; i++) {
    displayEmoji(getRandomNumber(1, 5));
    document.write(`<br>`);
  }
}

function drawSeparatingLine() {
  document.write(`<br>===============<br>`);
};

displayEmoji(1);
drawSeparatingLine();
displayEmoji(getNumber());
drawSeparatingLine();
displayEmoji(getRandomNumber(1, 5));
drawSeparatingLine();
displayAllEmojis();
drawSeparatingLine();
show100RandomEmojis();

