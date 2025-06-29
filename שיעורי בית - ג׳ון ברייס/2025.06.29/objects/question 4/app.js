const creditCard = {
    type: `visa`,
    number: 4586112599808766,
    exp: `12/28`,
    cvc: 189,
};

console.log(creditCard);

for (const prop in creditCard) {
    console.log(`${prop}: ${creditCard[prop]}`);
}