function cool(callback) {
	callback();
}

cool(function getRandomNumber() {document.write(parseInt(Math.random() * (100)) + 1)})