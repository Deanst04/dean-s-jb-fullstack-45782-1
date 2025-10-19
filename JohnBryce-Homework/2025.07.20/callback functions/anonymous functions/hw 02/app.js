function cool(callback) {
	callback();
}

cool(function () {document.write(parseInt(Math.random() * (100)) + 1)})