const hardArray = [10, 20, 30, 40, 50];
const randomArray = [];

for (let i = 0; i < 5; i++) {
  randomArray.push(parseInt(Math.random() * 100) + 1);
}

function displayArray(array) {
  for (let i = 0; i < array.length; i++) {
    document.write(`${array[i]}, `);
  }
}

displayArray(hardArray);
document.write(`<br>`);
displayArray(randomArray);