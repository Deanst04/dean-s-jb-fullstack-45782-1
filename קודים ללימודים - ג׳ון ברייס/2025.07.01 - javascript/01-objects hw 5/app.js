const costumer = {
    firstName: `Daniel`,
    lastName: `Cohen`,
    email: `daniel.cohen@example.com`,
    phone: `052-1234567`,
    creditCard: {
        type: `Visa`,
        number: `4580123412341234`,
        exp: `12/26`,
        cvc: `123`,
    },
};

console.log(costumer.firstName);
console.log(costumer.lastName);
console.log(costumer.email);
console.log(costumer.phone);
console.log(costumer.creditCard.type);
console.log(costumer.creditCard.number);
console.log(costumer.creditCard.exp);
console.log(costumer.creditCard.cvc);

console.log(`===============================`)

for (const prop in costumer) {
    if (prop !== "creditCard") {
       console.log(`${prop}: ${costumer[prop]}`);
    } else {
        for (const creditCardProp in costumer.creditCard) {
            console.log(`${creditCardProp}: ${costumer.creditCard[creditCardProp]}`);
        };
    };
};