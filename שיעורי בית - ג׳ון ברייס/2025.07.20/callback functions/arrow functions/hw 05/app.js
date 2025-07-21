function cool(paintCallback) {
  paintCallback();
}

const colors = ["#87CEEB", "#90EE90", "#ADD8E6", "#F0E68C", "#D3D3D3"];


cool(() => {
    const randomIndex = parseInt(Math.random() * (colors.length));
    document.body.style.backgroundColor = colors[randomIndex];
});