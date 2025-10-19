// const colors = [
//   "red",
//   "blue",
//   "green",
//   "yellow",
//   "purple",
//   "orange",
//   "pink",
//   "teal",
//   "maroon",
//   "navy",
// ];

const r = () => Math.floor(Math.random() * (256))
const g = () => Math.floor(Math.random() * (256))
const b = () => Math.floor(Math.random() * (256))
const rgb = () => `rgb(${r()}, ${g()}, ${b()})`

setInterval(() =>
  document.body.style.backgroundColor = rgb()
, 1 * 1000);
