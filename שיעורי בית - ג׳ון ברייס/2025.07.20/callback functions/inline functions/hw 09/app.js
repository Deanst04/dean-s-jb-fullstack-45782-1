const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "teal",
  "maroon",
  "navy",
];

setInterval(function changeBg() {
  document.body.style.backgroundColor = colors[parseInt(Math.random() * colors.length)]
}, 1 * 1000);
