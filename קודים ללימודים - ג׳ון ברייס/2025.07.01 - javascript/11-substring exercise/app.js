const message = prompt(`please write something`);

const firstWord = message.substring(0, message.indexOf(` `)).toUpperCase();
console.log(firstWord);

// if we want to substring until the end of the string, we can omit the 2nd argument
const lastWord = message.substring(message.lastIndexOf(` `) + 1).toUpperCase();
console.log(lastWord);
