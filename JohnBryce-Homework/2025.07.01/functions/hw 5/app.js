const userNumber1 = +prompt(`please enter a number`);
const userNumber2 = +prompt(`please enter a number`);
const userNumber3 = +prompt(`please enter a number`);
const random1 = parseInt((Math.random() * 100) + 1);
const random2 = parseInt((Math.random() * 100) + 1);
const random3 = parseInt((Math.random() * 100) + 1);

function average(num1, num2, num3) {
    let sum = num1 + num2 + num3;
    document.write(`the average is: ${sum / 3}<br>`);
}

average(10, 50, 30);
average(userNumber1, userNumber2, userNumber3);
average(random1, random2, random3);