const userNumber = +prompt(`please enter a number between 1 - 5`);
const random = parseInt(Math.random() * 5 + 1);

function emoji(num) {
  if (num === 1) {
    document.write(":-)<br>");
  } else if (num === 2) {
    document.write(":-(<br>");
  } else if (num === 3) {
    document.write(":-/<br>");
  } else if (num === 4) {
    document.write(";-)<br>");
  } else if (num === 5) {
    document.write(";-(<br>");
  } else {
    document.write("invalid number<br>");
  }
}

function showAllEmojis() {
    for (let i = 0; i < 5; i++) {
    emoji(i + 1);
}
}

function showRandomEmojis() {
    for (let i = 0; i < 100; i++) {
  let randomNumber = parseInt(Math.random() * 5 + 1);
  emoji(randomNumber);
}
}

emoji(1);
emoji(userNumber);
emoji(random);
document.write(`==================== all the emojis: <br>`);

showAllEmojis();

document.write(`==================== 100 random emojis: <br>`);

showRandomEmojis();
