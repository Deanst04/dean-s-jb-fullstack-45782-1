const array1 = [10, 5, 6, 7, 1];
const array2 = [20, 20, 4, 8, 13];
const array3 = [1, 15, 30, 100, 32];

function getAverageOfArray(array) {
  let sum = 0;
  for (const number of array) {
    sum += number;
  }
  return sum / array.length;
}

function getNumberLargerThanAverageOfArray(array) {
  let equalOrMoreThanAverage = 0;
  const avg = getAverageOfArray(array);
  for (const number of array) {
    if (number >= avg) equalOrMoreThanAverage++;
  }
  return equalOrMoreThanAverage;
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(
  `the number/s that are equal or greater than the average of the array [${array1}] is: ${getNumberLargerThanAverageOfArray(
    array1
  )}`
);
displaySeparationLine();
document.write(
  `the number/s that are equal or greater than the average of the array [${array2}] is: ${getNumberLargerThanAverageOfArray(
    array2
  )}`
);
displaySeparationLine();
document.write(
  `the number/s that are equal or greater than the average of the array [${array3}] is: ${getNumberLargerThanAverageOfArray(
    array3
  )}`
);
displaySeparationLine();
