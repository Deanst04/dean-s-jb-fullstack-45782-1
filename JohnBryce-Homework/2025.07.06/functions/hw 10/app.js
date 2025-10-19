function displayAverageOfArray(array) {
  let sum = 0;
  for (const number of array) {
    sum += number
  }
  return document.write(`the average is ${(sum / array.length).toFixed(2)}`);
}

function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function getRandomArray(repetition) {
  const randomArray = [];
  for (let i = 1; i <= repetition; i++) {
    randomArray.push(getRandomNumber(1, 10));
  }
  return randomArray;
}

function drawSeparatingLine() {
  document.write(`<br>===============<br>`);
}

displayAverageOfArray([10, 50, 44, 60, 99]);
drawSeparatingLine();
displayAverageOfArray(getRandomArray(10));
