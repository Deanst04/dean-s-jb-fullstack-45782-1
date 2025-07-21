function amazing(callback) {
	const num = callback(42, 128, 37, 81, 66);
	document.write(`Num: ${num}`);
}

amazing((a, b, c, d, e) => {
    const numbers = [a, b, c, d, e];
    return numbers[(parseInt(Math.random() * (numbers.length)))]
});

