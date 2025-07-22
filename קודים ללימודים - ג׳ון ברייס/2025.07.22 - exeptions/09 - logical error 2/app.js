const getMax = price => price * 1.17

const price = +prompt(`enter a price`)

console.log(`the price including vat is ${getMax(price)}`);