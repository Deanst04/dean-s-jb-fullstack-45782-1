const userMessage = prompt(`please enter a message`);
const userMessageRepetition = +prompt(`please enter the number of time you want your message to be displayed`);
function message(argument, repeat) {
    for (let i = 0; i < repeat; i++) {
        document.write(`${argument}<br>`);
    }
}

message(`hello`, 10);
document.write(`<====================><br>`);
message(userMessage, userMessageRepetition);