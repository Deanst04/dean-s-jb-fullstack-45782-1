let num1 = +prompt("please enter a number");
let num2 = +prompt("please enter a number");

document.write(`${num1} divided by ${num2} is: ${(num1 / num2).toFixed(2)} <br>`);
document.write(`${num2} divided by ${num1} is: ${(num2 / num1).toFixed(2)} <br>`);