const num = +prompt(`enter a number`);
// O(n)
for (let i = 0; i < num; i++) {
  console.log(i);
}

// O(n**2)
for (let i = 0; i < num; i++) {
  for (let z = 0; z < num; z++) {
    console.log(i);
  }
}

// O(n**3)
for (let i = 0; i < num; i++) {
  for (let z = 0; z < num; z++) {
    for (let x = 0; x < num; x++) {
      console.log(i);
    }
  }
}
