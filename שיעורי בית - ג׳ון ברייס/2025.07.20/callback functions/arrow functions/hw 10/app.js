setInterval(function () {
  const random100NumbersArray = [];
  for (let i = 0; i < 100; i++) {
  random100NumbersArray.push(parseInt(Math.random() * (100)) + 1)
  }
  document.getElementById("array").innerText = `[${random100NumbersArray}]`;
}, 3 * 1000);
