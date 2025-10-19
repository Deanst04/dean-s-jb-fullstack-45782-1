function showSomething(something) {
    console.log(`something is ${something}`)
    console.log(`something type is ${typeof something}`)
}

const name = `shahar`

showSomething(name);
showSomething(96);

showSomething(showSomething);
showSomething(console.log);