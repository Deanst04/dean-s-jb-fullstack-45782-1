const costumer = {
    firstName: `Dean`,
    lastName: `Stark`,
    email: `example@gmail.com`,
    phone: `0584621006`,
    creditCard: {
        type: `visa`,
        number: 4856444488881111,
        exp: `10/30`,
        cvc: 178,
    },
};

console.log(costumer);

for (const prop in costumer) {
    if (prop !== `creditCard`) {
        console.log(`${prop}: ${costumer[prop]}`);
    } else {
        for (const innerProp in costumer.creditCard) {
            console.log(`${innerProp}: ${costumer.creditCard[innerProp]}`)
        }
    } 
} 
