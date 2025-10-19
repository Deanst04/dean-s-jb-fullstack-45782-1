function getUserNumber() {
  return +prompt(`enter number`);
}

function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function displayAverage(num1, num2, num3) {
  return document.write(`the average is ${(num1 + num2 + num3) / 3}`);
}

function drawSeparatingLine() {
  document.write(`<br>===============<br>`);
};

displayAverage(10, 90, 50);
drawSeparatingLine();
displayAverage(getUserNumber(), getUserNumber(), getUserNumber());
drawSeparatingLine();
displayAverage(getRandomNumber(1, 100), getRandomNumber(1, 100), getRandomNumber(1, 100));