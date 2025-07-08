const legitMultiplicationBoardMatrix = [
  [2, 4, 6, 8, 10],
  [4, 8, 12, 16, 20],
  [6, 12, 18, 24, 30],
];

const notLegitMultiplicationBoardMatrix = [
  [10, 5, 6, 7, 1],
  [20, 20, 4, 8, 13],
  [1, 15, 30, 100, 32],
];

function checkIfMatrixIsALegitMultiplicationalBoard(matrix) {
  for (const array of matrix) {
    const base = array[0];
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== base * (i + 1)) return false; 
      }
  }
  return true;
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
displayMatrix(legitMultiplicationBoardMatrix);
displaySeparationLine();
document.write(
  `the matrix legit test is: ${checkIfMatrixIsALegitMultiplicationalBoard(legitMultiplicationBoardMatrix)}`
);

displaySeparationLine()

document.write(`the matrix is: <br>`);
displayMatrix(notLegitMultiplicationBoardMatrix);
displaySeparationLine();
document.write(
  `the matrix legit test is: ${checkIfMatrixIsALegitMultiplicationalBoard(notLegitMultiplicationBoardMatrix)}`
);
