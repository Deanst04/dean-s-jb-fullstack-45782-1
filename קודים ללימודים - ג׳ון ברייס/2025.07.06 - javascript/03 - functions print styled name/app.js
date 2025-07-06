const firstName = prompt(`please enter your first name`);
const lastName = prompt(`please enter your last name`);

function printStyledFirstName() {
    console.log(`${firstName[0].toUpperCase()}${firstName.substring(1)}`);
}

function printStyledLastName() {
    console.log(`${lastName[0].toUpperCase()}${lastName.substring(1)}`);
}

printStyledFirstName();
printStyledLastName();

