const randomNumbers = []

for (let i = 0; i < 100; i++) {
    randomNumbers.push(parseInt(Math.random() * (100 - 1 + 1) + 1));
    document.write(`${randomNumbers[i]} | `);
    console.log(`${randomNumbers[i]} | `);
}
document.write(`<br><br>`);


for (let i = randomNumbers.length - 1; i >= 0; i--) {
    document.write(`${randomNumbers[i]} `);
}

document.write(`<br><br>`);
let sum = 0;
let avg = 0;

for (let i = 0; i < 100; i++) {
    sum += parseInt(randomNumbers[i]);
    avg++
}
document.write(`the sum is: ${sum}`);
document.write(`<br><br>`);


document.write(`the average is: ${parseInt(sum / avg)}`);
document.write(`<br><br>`);

let odd = 0;
document.write(`even numbers: `)
for (const number of randomNumbers) {
    if (number % 2 == 0) {
        document.write(`${number}, `)
    } else {
        odd++
    }
}

document.write(`<br><br>`);
document.write(`the array has ${odd} odd numbers`);


document.write(`<br><br>`);
let max = 0;
let min = randomNumbers[0];

for (const number of randomNumbers) {
    max = number >= max ? number : max;
    min = number <= min ? number : min
}
document.write(`the largest number in the array is: ${max}`);
document.write(`<br>`);
document.write(`the smallest number in the array is: ${min}`);

document.write(`<br><br>`);


let underAvg = 0;

document.write(`The numbers that are larger than the average are: `);
for (const number of randomNumbers) {
    if (parseInt(number) >= sum / avg) {
        document.write(`${number}, `);
    } else {
        underAvg++
    }
}


document.write(`<br><br>`);
document.write(`The numbers that are smaller than the average are: ${underAvg}`);





