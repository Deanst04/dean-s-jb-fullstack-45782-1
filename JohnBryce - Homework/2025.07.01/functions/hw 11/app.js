const min = +prompt(`please enter minimum number`);
const max = +prompt(`please enter maximum number`);


function randomNumber(start, end) {
  document.write(`${parseInt((Math.random() * (end - start + 1)) + start)}<br>`);
}

randomNumber(1, 50);
document.write(`==================<br>`);
randomNumber(min, max);
document.write(`==================<br>`);
for (let i = 0; i < 100; i++) {
  randomNumber(-10, 10);
}