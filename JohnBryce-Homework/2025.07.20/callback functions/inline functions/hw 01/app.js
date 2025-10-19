function displayFunc(callback) {
    callback();
}

displayFunc(function displayFullName() {document.write(`Dean Stark`)});