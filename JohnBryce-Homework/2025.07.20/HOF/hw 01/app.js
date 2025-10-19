const random20NumbersArray = () => {
    const randomArray = [];
    for (let i = 0; i < 20; i++) {
        randomArray.push(Math.floor(Math.random() * (100)) + 1);
    }
    return randomArray;
}

const randArr = random20NumbersArray();
console.log(randArr);

console.log(`question 1`)
randArr.forEach((num, i) => console.log(num));
console.log(`<===========================>`);

console.log(`question 2`)
console.log(randArr.find(num => num % 2 === 0));
console.log(`<===========================>`);

console.log(`question 3`)
console.log(randArr.find(num => num > 50));
console.log(`<===========================>`);

console.log(`question 4`)
console.log(randArr.filter(num => num % 2 !== 0));
console.log(`<===========================>`);

console.log(`question 5`)
console.log(randArr.filter(num => num > 50));
console.log(`<===========================>`);

console.log(`question 6`)
console.log(randArr.findIndex(num => num > 50));
console.log(`<===========================>`);

console.log(`question 7`)
randArr.forEach(num => {
    if (num % 2 === 0) console.log(`even: ${num}`);
    else console.log(`odd: ${num}`);
});
console.log(`<===========================>`);

console.log(`question 8`)
console.log(`The max number is ${randArr.reduce((acc, curr) => curr > acc ? curr : acc, randArr[0])}`);
console.log(`<===========================>`);

console.log(`question 9`)
console.log(`The min number is ${randArr.reduce((acc, curr) => curr < acc ? curr : acc, randArr[0])}`);
console.log(`<===========================>`);