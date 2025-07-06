function getAbsoluteValue(num) {
    if (num >= 0) return num;
    return -num;
}

const input = +prompt(`enter a number`);
console.log(`the absolute value of ${input} is ${getAbsoluteValue(input)}`);