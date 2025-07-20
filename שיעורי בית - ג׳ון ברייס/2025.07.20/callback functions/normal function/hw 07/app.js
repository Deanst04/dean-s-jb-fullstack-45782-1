function amazing(paintCallback) {
	const paintedColor = paintCallback(`Red`, `Green`, `Blue`);
	document.getElementById("display-color").innerText = `Painted Color: ${paintedColor}`;
}


function getColor(color1, color2, color3) {
    const colors = [color1, color2, color3]
    const chosenColor = colors[parseInt(Math.random() * (colors.length))];
    document.body.style.backgroundColor = chosenColor;
    return chosenColor
}


amazing(getColor);