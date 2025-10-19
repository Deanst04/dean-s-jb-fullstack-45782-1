function amazing(callback) {
	const num = callback(42, 128, 37, 81, 66);
	document.write(`Num: ${num}`);
}

function getRandomNumber(a, b, c, d, e) {
    const numbers = [a, b, c, d, e];
    return numbers[(parseInt(Math.random() * (4 - 0 + 1)))]
}

amazing(getRandomNumber);

