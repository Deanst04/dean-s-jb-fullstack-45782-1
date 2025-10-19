function displayRandomNumberFromRange(min, max) {
  return document.write(getRandomNumberFromRange(min, max));
}

function getRandomNumberFromRange(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function display100RandomNumbers(min, max) {
  for (let i =1; i <= 100; i++) {
    document.write(`${getRandomNumberFromRange(min, max)}<br>`);
  }
}

function drawSeparatingLine() {
  document.write(`<br>===============<br>`);
}

displayRandomNumberFromRange(10, 50);
drawSeparatingLine();
displayRandomNumberFromRange(+prompt(`please enter min`), +prompt(`please enter max`));
drawSeparatingLine();
display100RandomNumbers(-10, 10);