import ArrayOperations from "./operations.js";
const randomArr = [];
for (let i = 0; i < 10; i++) {
    const randomNum = Math.floor(Math.random() * 100);
    randomArr.push(randomNum);
}
console.log(`the array: ${randomArr}`);
console.log(`array sum: ${ArrayOperations.getSum(randomArr)}`);
console.log(`array average: ${ArrayOperations.getAvg(randomArr)}`);
console.log(`array max: ${ArrayOperations.getMax(randomArr)}`);
console.log(`array min: ${ArrayOperations.getMin(randomArr)}`);
