const pizzaArr = [];
const pizzaDiameter = () => Math.floor(Math.random() * (50 - 10 + 1) + 10);
const pizzaSlices = () => Math.floor(Math.random() * (12 - 4 + 1) + 4);
const pizzaToppings = () => Math.floor(Math.random() * (6));
const pizzaPrice = () => Math.floor(Math.random() * (120 - 20 + 1) + 20);

for (let i = 0; i < 20; i++) {
    pizzaArr.push({
        Diameter: pizzaDiameter(),
        Slices: pizzaSlices(),
        Toppings: pizzaToppings(),
        Price: pizzaPrice(),
    })
}

console.log(pizzaArr);

console.log(`question 1`)
pizzaArr.forEach(pizza => console.log(pizza));
console.log(`<========================>`)

console.log(`question 2`)
const pizzaWithoutToppings = pizzaArr.find(pizza => pizza.Toppings === 0);
console.log(pizzaWithoutToppings || `there is no such pizza without toppings`);
console.log(`<========================>`)

console.log(`question 3`)
const priceLessThan30 = pizzaArr.find(pizza => pizza.Price < 30);
console.log(priceLessThan30 || `there is no such pizza with price less than 30 NIS`);
console.log(`<========================>`)

console.log(`question 4`)
console.log(pizzaArr.filter(pizza => pizza.Diameter <= 20));
console.log(`<========================>`)

console.log(`question 5`)
console.log(pizzaArr.filter(pizza => pizza.Price > 80));
console.log(`<========================>`)

console.log(`question 6`)
console.log(pizzaArr.filter(pizza => pizza.Toppings === 0));
console.log(`<========================>`)

console.log(`question 7`)
console.log(pizzaArr.findIndex(pizza => pizza.Slices === 6));
console.log(`<========================>`)

console.log(`question 8`)
pizzaArr.forEach(pizza => console.log(`the radius is: ${pizza.Diameter / 2}`));
console.log(`<========================>`)

console.log(`question 9`)
const pizzaArrWithVat = pizzaArr.map(pizza => ({
    originalPrice: pizza.Price,
    vat: +(pizza.Price * 0.17).toFixed(2),
}))
console.log(pizzaArrWithVat);
console.log(`<========================>`)

console.log(`question 10`)
const pizzaPricesSum = pizzaArr.reduce((acc, curr) => acc + curr.Price, 0)
console.log(`the sum of the pizzas prices is: ${pizzaPricesSum} NIS`);
console.log(`<========================>`)

console.log(`question 11`)
const MaxPrice = pizzaArr.reduce((acc, curr) => curr.Price > acc ? curr.Price : acc, pizzaArr[0].Price);
console.log(`the max price is: ${MaxPrice}`);
console.log(`<========================>`)

console.log(`question 12`)
const pizzaWithMaxPrice = pizzaArr.reduce((acc, curr) => curr.Price > acc.Price ? curr : acc, pizzaArr[0]);
console.log(`the pizza with the max price is:`);
console.log(pizzaWithMaxPrice);
console.log(`<========================>`)