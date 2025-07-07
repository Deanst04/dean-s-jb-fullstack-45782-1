const userMatrix = [
  [10, 5, 6, 7, 1],
  [20, 20, 4, 8, 13],
  [1, 15, 30, 100, 32],
]

function getMaxNumberOfMatrix(matrix) {
  let maxNumber = matrix[0][0];
  for (const array of matrix) {
    for (const max of array) {
      if (max > maxNumber) maxNumber = max;
    }
  }
  return maxNumber;
}

function displayMatrix(matrix) {
  for (const array of matrix) {
    document.write(`[${array}], <br>`);
  }
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(
  `the matrix is: <br>`
);
displayMatrix(userMatrix);
displaySeparationLine();
document.write(
  `the max number of the matrix is: ${getMaxNumberOfMatrix(
    userMatrix
  )}`
);
