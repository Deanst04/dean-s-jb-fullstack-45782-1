function getRandomNumberBetween1To100() {
  return parseInt(Math.random() * 100 + 1);
}

const randArr1 = getRandomArray();
const randArr2 = getRandomArray();
const primeArr = [2, 3, 5, 7, 11];

function getRandomArray() {
  const RandomArray = [];
  for (let i = 0; i < 5; i++) {
    RandomArray.push(getRandomNumberBetween1To100());
  }
  return RandomArray;
}

function displayArrToConsole(arr) {
  console.log(arr);
}

function drawSeparatingLine() {
  console.log(`<==================>`);
}

function isPrime(number) {
  if (number < 2) return false;
  for (let i = 2; i < number; i++) {
      if (number % i === 0) return false;
    }
    return true;
}

function checkIfAllNumberOfArrayIsPrimeNumber(arr) {
  for (const number of arr) {
    if (!isPrime(number)) return false;
  }
  return true;
}

displayArrToConsole(randArr1);
drawSeparatingLine();
displayArrToConsole(randArr2);
drawSeparatingLine();
displayArrToConsole(primeArr);
drawSeparatingLine();
console.log(
  `Are all numbers in [${randArr1}] prime? ${checkIfAllNumberOfArrayIsPrimeNumber(
    randArr1
  )}`
);
drawSeparatingLine();
console.log(
  `Are all numbers in [${randArr2}] prime? ${checkIfAllNumberOfArrayIsPrimeNumber(
    randArr2
  )}`
);
drawSeparatingLine();
console.log(
  `Are all numbers in [${primeArr}] prime? ${checkIfAllNumberOfArrayIsPrimeNumber(
    primeArr
  )}`
);
drawSeparatingLine();
