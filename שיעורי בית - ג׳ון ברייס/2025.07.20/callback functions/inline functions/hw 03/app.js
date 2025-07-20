function nice(callback) {
	callback(42);
}


nice(function displayNumber(num) {document.write(num)});