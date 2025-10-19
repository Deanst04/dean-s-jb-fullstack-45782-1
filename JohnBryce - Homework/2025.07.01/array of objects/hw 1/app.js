const car1 = {
    model: `alfa romeo 4c`,
    year: 2008,
    color: `red`,
};

const car2 = {
    model: `ferrari 458 italia`,
    year: 2018,
    color: `red`,
};

const car3 = {
    model: `lamborghini huracan`,
    year: 2020,
    color: `green`,
};

const cars = [car1, car2, car3];

for (const car of cars) {
    console.log(`model: ${car.model}`);
    console.log(`year: ${car.year}`);
    console.log(`color: ${car.color}`);
};

console.log(`=========================`);

for (const car of cars) {
    for (const prop in car) {
        console.log(`${prop}: ${car[prop]}`);
    }
};