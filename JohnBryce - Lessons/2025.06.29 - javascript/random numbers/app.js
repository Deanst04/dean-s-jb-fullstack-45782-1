const random = Math.random(); // 0 - 0.99999999

console.log((random * 100)) // 0.999 - 99.999
console.log(parseInt(random * 100)) // 0 - 99
console.log(parseInt(random * 100) + 1) // 1 - 100