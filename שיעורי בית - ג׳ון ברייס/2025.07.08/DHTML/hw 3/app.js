const COLORS_KEY_NAME = "colors";

function addColor(event) {
  event.preventDefault(); // prevent form submission
  const data = collectDataFromForm();
  const newTR = generateTR(data);
  injectTRToDOM(newTR);
  saveColorToLocalStorage(data);
  clearForm();
}

function collectDataFromForm() {
  const color = document.getElementById("color").value;

  return {
    color,
  };
}

function generateTR(data) {
  const newTR = `
        <tr >
            <td>${data.color}</td>
            <td style="background-color: ${data.color};"></td>
        </tr>
    `;
  return newTR;
}

function injectTRToDOM(newTR) {
  document.getElementById("color-list").innerHTML += newTR;
}

function loadColorsFromStorage() {
  const colorsJSON = localStorage.getItem(COLORS_KEY_NAME);
  if (colorsJSON) {
    const colors = JSON.parse(colorsJSON);
    for (const color of colors) {
      const newTR = generateTR(color);
      injectTRToDOM(newTR);
    }
  }
}

function saveColorToLocalStorage(color) {
  const colorsJSON = localStorage.getItem(COLORS_KEY_NAME) || "[]";
  const colors = JSON.parse(colorsJSON);
  colors.push(color);
  localStorage.setItem(COLORS_KEY_NAME, JSON.stringify(colors));
  countHowManyColors(colors);
}

function clearForm() {
  document.getElementById("color-form").reset();
}

function countHowManyColors(colors) {
    if (colors.length === 1) document.getElementById("color-number").innerHTML = `You added ${colors.length} color`;
    else document.getElementById("color-number").innerHTML = `You added ${colors.length} colors in total`;
}

function displayHowManyColors() {
  const colorsJSON = localStorage.getItem(COLORS_KEY_NAME) || "[]";
  const colors = JSON.parse(colorsJSON);
  countHowManyColors(colors);
}

loadColorsFromStorage();
displayHowManyColors();