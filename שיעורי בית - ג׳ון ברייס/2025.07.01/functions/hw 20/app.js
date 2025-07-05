const number = +prompt(`please enter a number`);

function spaces(count) {
  for (let i = 0; i < count; i++) {
    document.write(`  `);
  }
}

function increase(count) {
  for (let i = 1; i <= count; i++) {
    document.write(`${i} `);
  }
}

function decrease(count) {
  for (let i = count - 1; i >= 1; i--) {
    document.write(`${i} `);
  }
}

function pyramid(n) {
  document.write(`<pre>`);
  for (let row = 1; row <= n; row++) {
    spaces(n - row);
    increase(row);
    decrease(row);
    document.write(`<br>`);
  }
  document.write(`</pre>`);
}


pyramid(number);
