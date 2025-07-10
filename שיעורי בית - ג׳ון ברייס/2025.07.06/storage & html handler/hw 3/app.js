const COLOR_KEY_NAME = "color";

function changeColor(event) {
    const color = colorPicked();
    changeBackgroundColor(color);
    saveColorToStorage(color);
}

function colorPicked() {
    const selectedColor = document.getElementById("color-pick").value;

    return selectedColor;
}

function changeBackgroundColor(color) {
   document.body.style.backgroundColor = color;
}

function saveColorToStorage(color) {
    localStorage.setItem(COLOR_KEY_NAME, color);
}

function loadColorFromStorage() {
   const savedColor = localStorage.getItem(COLOR_KEY_NAME);
    if (!savedColor) return;
   
   document.getElementById("color-pick").value = savedColor;
   changeBackgroundColor(savedColor);
}

loadColorFromStorage();
