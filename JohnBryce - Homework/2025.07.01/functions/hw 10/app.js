const hardArray = [10, 20, 30, 40, 50];
const randomArray = [];

for (let i = 0; i < 5; i++) {
  randomArray.push(parseInt(Math.random() * 100) + 1);
}

function displayAverage(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  document.write(`the average is: ${sum / array.length}`);
}

displayAverage(hardArray);
document.write(`<br>`);
displayAverage(randomArray);