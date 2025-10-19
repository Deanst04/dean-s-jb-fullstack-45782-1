function getRandomNumberBetween1To100() {
  return parseInt(Math.random() * 100 + 1);
}

function createArray(length, randArr) {
  for (let i = 0; i < length; i++) {
    randArr.push(getRandomNumberBetween1To100());
  }
}

function displayRandomArrayWithRandomLength(length) {
  const randArr = [];
  createArray(length, randArr);
  return randArr;
}

function drawSeparatingLine() {
  console.log(`<==================>`);
}

const length1 = +prompt(`enter length of an array`);
console.log(
  `here is an array with ${length1} of numbers: [${displayRandomArrayWithRandomLength(
    length1
  )}]`
);
drawSeparatingLine();
const length2 = +prompt(`enter length of an array`);
console.log(
  `here is an array with ${length2} of numbers: [${displayRandomArrayWithRandomLength(
    length2
  )}]`
);
drawSeparatingLine();
const length3 = +prompt(`enter length of an array`);
console.log(
  `here is an array with ${length3} of numbers: [${displayRandomArrayWithRandomLength(
    length3
  )}]`
);
drawSeparatingLine();
