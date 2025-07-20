setInterval(() => {
  const now = new Date().toLocaleTimeString();
  document.getElementById("Clock").innerHTML = now;
}, 1 * 1000);
