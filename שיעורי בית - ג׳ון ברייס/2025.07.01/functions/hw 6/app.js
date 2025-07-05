const userNumber1 = +prompt(`please enter a number`);
const userNumber2 = +prompt(`please enter a number`);
const userNumber3 = +prompt(`please enter a number`);
const random1 = parseInt((Math.random() * 100) + 1);
const random2 = parseInt((Math.random() * 100) + 1);
const random3 = parseInt((Math.random() * 100) + 1);

function findMax(num1, num2, num3) {
    let max;
    if (num1 >= num2 && num1 >= num3) max = num1;
    else if (num2 >= num1 && num2 >= num3) max = num2;
    else if (num3 >= num1 && num3 >= num2) max = num3;
    document.write(`the largest number is: ${max}<br>`);
}

findMax(10, 50, 30);
findMax(userNumber1, userNumber2, userNumber3);
findMax(random1, random2, random3);