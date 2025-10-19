function submitFruit() {
  const fruit = document.getElementById(`fruit`).value;
  const fruitList = document.getElementById(`list`);
  console.log(fruitList);
  const newLi = `<li>${fruit}</li>`;
  
  fruitList.innerHTML += newLi;
  document.getElementById(`fruit`).value = ``;
}
