const randomNumbers = [];

for (let rep = 0; rep < 20; rep++) {
    randomNumbers.push(parseInt(Math.random() * 30 - (1) + 1) + 1);
}
console.log(randomNumbers);

const userRandomNumber = +prompt(`please enter a number between 1 to 30`);
let isBingo = false;

for (const randomNumber of randomNumbers) {
    if (userRandomNumber === randomNumber) isBingo = true;
}
console.log(`${isBingo = true ? "bingo!" : "not a bingo!"}`)
