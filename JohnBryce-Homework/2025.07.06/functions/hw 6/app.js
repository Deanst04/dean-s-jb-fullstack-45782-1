function getMaxNumber() {
  return +prompt(`enter number`);
}

function getMaxRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function displayMaxNumber(num1, num2, num3) {
  if (num1 >= num2 && num1 >= num3) return document.write(`the max number is ${num1}`);
  else if (num2 >= num1 && num2 >= num3) return document.write(`the max number is ${num2}`);
  else return document.write(`the max number is ${num3}`);
}

function drawSeparatingLine() {
  document.write(`<br>===============<br>`);
};

displayMaxNumber(10, 40, 44);
drawSeparatingLine();
displayMaxNumber(getMaxNumber(), getMaxNumber(), getMaxNumber());
drawSeparatingLine();
displayMaxNumber(getMaxRandomNumber(1, 100), getMaxRandomNumber(1, 100), getMaxRandomNumber(1, 100));