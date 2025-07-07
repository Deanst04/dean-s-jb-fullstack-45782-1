function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function getRandomArray() {
  const randomArray = [];
  for (let i = 0; i < 5; i++) {
    randomArray.push(getRandomNumber(1, 30));
  }
  return randomArray;
}

function getRandomArrayAverage(array) {
  let sum = 0;
  for (const number of array) {
    sum += number;
  }
  return (sum / array.length).toFixed(2);
}

function displayAverage() {
    const array = getRandomArray();
    document.write(`the average of [${array}] is: ${getRandomArrayAverage(array)}`)
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}


displayAverage();
displaySeparationLine();
displayAverage();
displaySeparationLine();
displayAverage();
