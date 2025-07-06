function getFullName() {
    return prompt(`please enter your full name`);
}

function showName100Times(name) {
    for (let i = 1; i <= 100; i++) {
        document.write(`${name}<br>`);
    }
}

showName100Times(getFullName());