// DRY implemented:
function printMaxNumber(num1, num2) {
    document.write(`the max number is: ${num1 > num2 ? num1 : num2}<br>`);
}

function getNumericalInputFromUser() {
    return +prompt(`enter a number`);
}

// DRY not implemented yet
const userNum1 = getNumericalInputFromUser();
const userNum2 = getNumericalInputFromUser();

printMaxNumber(userNum1, userNum2);

function getRandomNumber(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}

// DRY not implemented yet
const randomNum1 = getRandomNumber(0, 100);
const randomNum2 = getRandomNumber(0, 100);
const randomNum3 = getRandomNumber();
console.log(randomNum3);
printMaxNumber(randomNum1, randomNum2);




