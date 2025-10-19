const multiplicationBoard = [];
let sum = 0;

for (let row = 1; row < 11; row++) {
    const multiplicationBoardRow = [];
  for (let col = 1; col < 11; col++) {
    document.write(`${row * col} `);
    sum += row * col;
    multiplicationBoardRow.push(row * col);
  }
  document.write(`<br>`);
  multiplicationBoard.push(multiplicationBoardRow);
}

document.write(`<br> ${sum}`);
console.log(multiplicationBoard);