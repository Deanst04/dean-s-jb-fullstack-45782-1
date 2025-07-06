// DRY not implemented yet
const userNum1 = +prompt(`enter a number`);
const userNum2 = +prompt(`enter a number`);

// DRY not implemented yet
const randomNum1 = parseInt(Math.random() * 101);
const randomNum2 = parseInt(Math.random() * 101);

// DRY implemented:
function printMaxNumber(num1, num2) {
    document.write(`the max number is: ${num1 > num2 ? num1 : num2}<br>`);
}

printMaxNumber(userNum1, userNum2);
printMaxNumber(randomNum1, randomNum2);