function nice(paintCallback) {
	paintCallback(`green`);
}


nice(function getColor(color) {
    document.body.style.backgroundColor = color;
});