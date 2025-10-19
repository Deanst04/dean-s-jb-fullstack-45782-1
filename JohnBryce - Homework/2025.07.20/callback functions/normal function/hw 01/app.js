function displayFullName() {
    document.write(`Dean Stark`);
}

function displayFunc(callback) {
    callback();
}

displayFunc(displayFullName);