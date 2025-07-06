function getUserString() {
  return prompt(`please enter some message`);
}

function showSeparatingLine() {
  document.write(`=====================<br>`);
}

function showString10Times(string) {
  for (let i = 1; i <= 10; i++) {
    document.write(`${string}<br>`);
  }
}

showString10Times(`hey man, whats up`);
showSeparatingLine();
showString10Times(getUserString());
