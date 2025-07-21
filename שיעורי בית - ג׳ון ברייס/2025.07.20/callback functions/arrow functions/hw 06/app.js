function nice(paintCallback) {
  paintCallback(`green`);
}

nice(color => document.body.style.backgroundColor = color);
