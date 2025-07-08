function getRandomNumberBetween1To100() {
  return parseInt(Math.random() * (100) + 1);
}

const rand1 = getRandomNumberBetween1To100();
const rand2 = getRandomNumberBetween1To100();
const rand3 = getRandomNumberBetween1To100();

function displayRandToConsole(rand) {
  console.log(rand);
}

function drawSeparatingLine() {
  console.log(`<==================>`)
}


function checkIfNumberIsPrimeNumber(number) {
  if (number < 2) return false
  for (let i = 2; i < number; i++) {
    if (number % i === 0) return false
  }
  return true
}

displayRandToConsole(rand1);
drawSeparatingLine();
displayRandToConsole(rand2);
drawSeparatingLine();
displayRandToConsole(rand3);
drawSeparatingLine();
console.log(`does ${rand1} is prime? ${checkIfNumberIsPrimeNumber(rand1)}`);
drawSeparatingLine();
console.log(`does ${rand2} is prime? ${checkIfNumberIsPrimeNumber(rand2)}`);
drawSeparatingLine();
console.log(`does ${rand3} is prime? ${checkIfNumberIsPrimeNumber(rand3)}`);
drawSeparatingLine();
