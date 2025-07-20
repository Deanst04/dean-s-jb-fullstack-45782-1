function nice(paintCallback) {
	paintCallback(`green`);
}


nice(function (color) {
    document.body.style.backgroundColor = color;
});