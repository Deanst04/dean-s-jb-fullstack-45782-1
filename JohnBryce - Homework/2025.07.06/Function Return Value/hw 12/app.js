function getRandomNumberBetweenMinToMax(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}


const rand1 = getRandomNumberBetweenMinToMax(+prompt(`enter min number`), +prompt(`enter max number`));
const rand2 = getRandomNumberBetweenMinToMax(+prompt(`enter min number`), +prompt(`enter max number`));
const rand3 = getRandomNumberBetweenMinToMax(+prompt(`enter min number`), +prompt(`enter max number`));


function displayRandomNumberBetweenMinToMax(rand) {
  console.log(`${rand}`);
}

function drawSeparatingLine() {
  console.log(`<==================>`);
}


displayRandomNumberBetweenMinToMax(rand1);
drawSeparatingLine();
displayRandomNumberBetweenMinToMax(rand2);
drawSeparatingLine();
displayRandomNumberBetweenMinToMax(rand3);
drawSeparatingLine();
