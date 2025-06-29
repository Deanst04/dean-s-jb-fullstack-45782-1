const names = [];

for (let i = 0; i < 5; i++) {
    names.push(prompt(`please enter a name`));
}
console.log(names[0], names[names.length - 1]);

for (const name of names) {
    console.log(name);
}


const reverseNames = [];
for (let reverseI = names.length - 1; reverseI >= 0; reverseI--) {
    reverseNames.push(names[reverseI]);
    
}
console.log(reverseNames);