const random20NumbersArray = () => {
    const randomArray = [];
    for (let i = 0; i < 20; i++) {
        randomArray.push(Math.floor(Math.random() * (100)) + 1);
    }
    return randomArray;
}

const randArr = random20NumbersArray();
console.log(randArr);

randArr.forEach((num, i) => console.log(num));
console.log(`<===========================>`);

console.log(randArr.find(num => num % 2 === 0));
console.log(`<===========================>`);

console.log(randArr.find(num => num > 50));
console.log(`<===========================>`);

console.log(randArr.filter(num => num > 50));
console.log(`<===========================>`);

console.log(randArr.findIndex(num => num > 50));
console.log(`<===========================>`);

randArr.forEach(num => {
    if (num % 2 === 0) console.log(`even: ${num}`);
    else console.log(`odd: ${num}`);
});
console.log(`<===========================>`);

console.log(`The max number is ${randArr.reduce((acc, curr) => curr > acc ? curr : acc, randArr[0])}`);
console.log(`<===========================>`);

console.log(`The min number is ${randArr.reduce((acc, curr) => curr < acc ? curr : acc, randArr[0])}`);
console.log(`<===========================>`);