function cool(callback) {
	callback();
}

function getRandomNumber() {
    document.write(parseInt(Math.random() * (100 - 1 + 1) + 1));
}

cool(getRandomNumber);