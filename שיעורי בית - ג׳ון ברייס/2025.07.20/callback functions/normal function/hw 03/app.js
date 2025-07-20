function nice(callback) {
	callback(42);
}

function displayNumber(number) {
    document.write(number)
}



nice(displayNumber);