const userMatrix = [
  [10, 5, 6, 7, 1],
  [20, 20, 4, 8, 13],
  [1, 15, 30, 100, 32],
];

function getAverageOfMatrix(matrix) {
  let sum = 0;
  let count = 0;
  for (const array of matrix) {
    for (const number of array) {
      sum += number;
      count++;
    }
  }
  return (sum / count).toFixed(2);
}

function displayMatrix(matrix) {
  for (const array of matrix) {
    document.write(`[${array}], <br>`);
  }
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(`the matrix is: <br>`);
displayMatrix(userMatrix);
displaySeparationLine();
document.write(
  `the average of the matrix is: ${getAverageOfMatrix(userMatrix)}`
);
