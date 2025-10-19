const min = +prompt(`please enter a minimum number`)
const max = +prompt(`please enter a maximum number`)


for (let rep = 1; rep <= 100; rep++) {
    const random = Math.random();
    console.log(parseInt(random * (max - min + 1)) + min);
}