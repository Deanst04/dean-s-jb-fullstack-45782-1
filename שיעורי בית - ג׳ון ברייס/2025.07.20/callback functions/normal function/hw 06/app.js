function nice(paintCallback) {
	paintCallback(`green`);
}

function getColor(color) {
    document.body.style.backgroundColor = color;
}


nice(getColor);