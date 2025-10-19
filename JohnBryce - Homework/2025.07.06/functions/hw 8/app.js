function showCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  document.write(`the current time is: ${hours}:${minutes}:${seconds}`);
}

showCurrentTime();