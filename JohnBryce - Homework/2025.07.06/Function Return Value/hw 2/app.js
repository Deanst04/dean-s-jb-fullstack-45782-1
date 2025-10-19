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

const array1 = getRandomArray();
const array2 = getRandomArray();
const array3 = getRandomArray();

function getRandomArrayMin(array) {
  let min = array[0];
  for (const number of array) {
    min = number <= min ? number : min;
  }
  return min;
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}


document.write(`the min number from [${array1}] is: ${getRandomArrayMin(array1)}`);
displaySeparationLine();
document.write(`the min number from [${array2}] is: ${getRandomArrayMin(array2)}`);
displaySeparationLine();
document.write(`the min number from [${array3}] is: ${getRandomArrayMin(array3)}`);
