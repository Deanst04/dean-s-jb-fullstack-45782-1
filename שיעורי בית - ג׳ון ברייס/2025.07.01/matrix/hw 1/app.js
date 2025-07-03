const matrix = [[12, 23, 34, 45], [56, 67, 78, 89], [10, 20, 30, 40]];

let sum = 0;
let count = 0;
let max = 0;
let min = 89;

for (const array of matrix) {
    for (const number of array) {
        console.log(number);
        document.write(`${number} `);
        sum += number;
        count++;
        max = number > max ? number : max;
        min = number < min ? number : min;
    }
}
document.write(`<br>the sum of the numbers is: ${sum}`);
console.log(sum);

document.write(`<br>the average of the numbers is: ${parseInt(sum / count)}`);
console.log(parseInt(sum / count));

document.write(`<br>the max number is: ${max}`);
console.log(max);
document.write(`<br>the min number is: ${min}`);
console.log(min);
document.write(`<br><br>`);

const emojiMatrix = [
    [12, 23, 34, 45],
    [56, 67, 78, 89],
    [10, 20, 30, 40]
];
for (let array = 0; array < emojiMatrix.length; array++) {
    for (let number = 0; number < emojiMatrix[array].length; number++) {
        if (emojiMatrix[array][number] % 7 !== 0) emojiMatrix[array][number] = `😊`;
        document.write(`${emojiMatrix[array][number]}, `);
    }
    document.write(`<br>`);
}
// document.write(emojiMatrix);
console.log(emojiMatrix);


