function myString(argument) {
    document.write(argument);
}

for (let i = 0; i < 10; i++) {
    myString(`what's up man<br>`);
}

document.write(`========================<br>`);

const userMessage = prompt(`please enter a message`);
for (let i = 0; i < 10; i++) {
    myString(`${userMessage}<br>`);
}