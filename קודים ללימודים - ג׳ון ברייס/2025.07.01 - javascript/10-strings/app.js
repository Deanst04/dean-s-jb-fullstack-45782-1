const message = `Hello World1`;
console.log(message);

console.log(message[2]);
console.log(message[7]);

// string is represented an array of characters
message[0] = "h"; // however, we cannot modify each char
console.log(message);

const upperCaseMessage = message.toUpperCase();
console.log(upperCaseMessage);

const lowerCaseMessage = message.toLocaleLowerCase();
console.log(lowerCaseMessage);


// includes
console.log(message.includes(`f`));
console.log(message.includes(`ell`));
console.log(message.includes(1));
console.log(message.includes(`HELLO`));

// startWith
console.log(message.startsWith(`h`));
console.log(message.startsWith(`H`));

// endsWith
console.log(message.endsWith(`h`));
console.log(message.endsWith(1));

// trim
const longMessage = `    hello world`;
console.log(longMessage.length);
const trimmed = longMessage.trim() 
console.log(trimmed.length);
console.log(trimmed);

// indexOf
console.log(message.indexOf(`l`));
console.log(message.indexOf(`ll`));
console.log(message.indexOf(`z`));

// lastIndexOff
console.log(message.lastIndexOf(`l`));
console.log(message.lastIndexOf(`ll`));
console.log(message.lastIndexOf(`z`));

// substring
const veryLongMessage = `welcome to Jamaica man, we can have a long of fun`;
console.log(veryLongMessage.substring(11, 18));



