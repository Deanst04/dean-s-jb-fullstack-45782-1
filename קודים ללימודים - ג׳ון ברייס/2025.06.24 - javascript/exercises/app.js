// question 1 > let num = 0
// while(num <= 100) {
//     document.write(`${num} \n`);
//     num++
// }

// question 2 > let num = 2;
// while(num <= 100) {
//     document.write(`${num} \n`)
//     num = num + 2;
// }

// question 3 > let num = 100;
// while(num >= 2) {
//     document.write(`${num} \n`);
//     num -= 2;
// }

// question 4 > let num = +prompt(`please enter a number, enter 0 to stop`)
// while(num != 0) {
//     alert(`${num**2}`);
//     num = +prompt(`please enter a number, enter 0 to stop`);
// }

// question 5 > let num = +prompt(`please enter a number, enter 0 to stop`);

// while(num != 0) {
//     alert(`${num} is ${num > 0 ? "positive" : "negative"}`);
//     num = +prompt(`please enter a number, enter 0 to stop`)
// }

// question 6 > let num = +prompt(`please enter a number, enter 0 to stop`);
// let prev = 0;
// let sum = 0;

// while(num != 0) {
//     prev += num;
//     sum = sum + prev + num
//     num = +prompt(`please enter a number`);
//     alert(`sum is ${sum}`);
// }

// question 7 > let num = +prompt(`please enter a number, enter 0 to stop`);
// let sum = 0;
// let rep = 0;

// while(num != 0) {
//     sum += num
//     rep++
//     num = +prompt(`please enter a number, enter 0 to stop`)
// }

// let avg = sum / (rep+1)
// alert(`the average is ${avg}`);


let num = +prompt(`please enter a number`);
let rep = 0;

while(rep <= num) {
    rep++;
    document.write(`${rep % 7 == 0 ? "boom" : rep} <br>`);  
}