// for (let count = 1; count <= 100; count++) {
//     document.write(`${count} <br>`);
// }


// question 1 > for(let num = -100; num <= 100; num+= 2) {
//     document.write(`${num} <br>`);
// }

// question 2 > let min = +prompt("please enter a minimum number")
// let max = +prompt("please enter a maximum number")

// if (min > max) {
//     let helper = min;
//     min = max;
//     max = helper; 
// }

// for(let rep = min; rep <= max; rep++) {
//     document.write(`${rep} <br>`);
// }

// question 3 option 1 > for(let num = 1; num <= 100; num++) {
//     if(num % 7 == 0) {
//         document.write(`${num**2} <br>`);
//     } else document.write(`${num} <br>`);
// }

// option 2 > for(let num = 1; num <= 100; num++) {
//     document.write(`${num % 7 == 0 ? num**2 : num} <br>`);
// }

// option 3 > for(let num = 7; num <= 100; num+=7) {
//     document.write(`${num**2} <br>`);
// }

// question 4 option 1 > let symbol = "**********";

// for(let rep = 0; rep < 10; rep++) {
//     document.write(`${symbol} <br>`)
// }


for(let row = 0; row < 10; row++) {
    for(let rep = 0; rep < 10; rep++) {
    document.write(`*`)
}
document.write(`<br>`)
}


