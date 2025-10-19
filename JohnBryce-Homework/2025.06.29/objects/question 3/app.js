const shirt = {
    brand: `fox`,
    size: `16`,
    color: `purple`,
    price: `40`,
};

console.log(shirt);

for (const prop in shirt) {
    console.log(`${prop}: ${shirt[prop]}`);
}

shirt.brand = prompt(`please enter a shirt brand`);
shirt.size = prompt(`please enter a shirt size`);
shirt.color = prompt(`please enter a shirt color`);
shirt.price = prompt(`please enter a shirt price`);

console.log(shirt);

for (const prop in shirt) {
    console.log(`${prop}: ${shirt[prop]}`);
}