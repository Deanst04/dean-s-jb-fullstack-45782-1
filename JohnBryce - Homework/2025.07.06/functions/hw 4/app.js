function getNumberOfRepetition() {
  return +prompt(`enter how many times you want your message to be displayed`);
}

function getMessage() {
  return prompt(`please leave a message`);
}

function displayMessage(message, repetition) {
  for (let i = 1; i <= repetition; i++) {
    document.write(`${message}<br>`);
  }
}

function drawSeparatingLine() {
  document.write(`===============<br>`);
}

displayMessage(`hey man, whats up`, 5);
drawSeparatingLine();
displayMessage(getMessage(), getNumberOfRepetition());
