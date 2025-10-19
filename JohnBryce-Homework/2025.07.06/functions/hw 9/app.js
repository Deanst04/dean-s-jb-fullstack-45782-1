function displayArray(array) {
  for (const number of array) {
    document.write(`${number}, `)
  }
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

displayArray([10, 50, 44, 60, 99]);
drawSeparatingLine();
displayArray(getRandomArray(10));
