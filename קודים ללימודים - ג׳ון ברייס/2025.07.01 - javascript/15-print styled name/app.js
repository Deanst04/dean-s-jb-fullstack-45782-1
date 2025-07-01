const firstName = prompt(`enter your first name`);
const lastName = prompt(`enter your last name`);

styleName(firstName);
styleName(lastName);

function styleName(name) {
    console.log(`${name[0].toUpperCase()}${name.substring(1)}`);
};



console.log(`hello`);
console.log(`world`);