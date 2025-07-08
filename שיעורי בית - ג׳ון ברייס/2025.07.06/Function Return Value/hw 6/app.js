const array1 = [10, 5, 6, 7, 1];
const array2 = [20, 20, 4, 8, 13];
const array3 = [1, 15, 30, 100, 32];

function getIndexOfMinNumberOfArray(array) {
  let minNumber = array[0];
  let minNumberIndex = 0;
  for (let index = 0; index < array.length; index++) {
    if (array[index] < minNumber) {
      minNumber = array[index];
      minNumberIndex = index;
    }
  }
  return minNumberIndex;
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(
  `the index of the min number in the array is [${array1}] is: ${getIndexOfMinNumberOfArray(
    array1
  )}`
);
displaySeparationLine();
document.write(
  `the index of the min number in the array is [${array2}] is: ${getIndexOfMinNumberOfArray(
    array2
  )}`
);
displaySeparationLine();
document.write(
  `the index of the min number in the array is [${array3}] is: ${getIndexOfMinNumberOfArray(
    array3
  )}`
);
displaySeparationLine();
