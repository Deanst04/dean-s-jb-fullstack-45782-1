function cool(callback) {
	callback();
}

cool(() => document.write(parseInt(Math.random() * (100)) + 1))