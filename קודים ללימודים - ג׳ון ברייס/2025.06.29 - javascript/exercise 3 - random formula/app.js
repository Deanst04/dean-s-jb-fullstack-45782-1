const random = Math.random();
const min = +prompt(`please enter a minimum number`)
const max = +prompt(`please enter a maximum number`)



console.log(parseInt(random * (max - min + 1) + min));
