const INGREDIENTS_KEY_NAME = "ingredients";

function addIngredients(event) {
  event.preventDefault(); // prevent form submission
  const data = collectDataFromForm();
  const newLI = generateLI(data);
  injectLIToDOM(newLI);
  saveIngredientToLocalStorage(data);
  clearForm();
}

function collectDataFromForm() {
  const ingredient = document.getElementById("ingredient").value;
  const amount = document.getElementById("amount").value;

  return {
    ingredient,
    amount,
  };
}

function generateLI(data) {
  const newLI = `<li>Ingredient: ${data.ingredient} , Amount: ${data.amount}</li>`
        
  return newLI;
}

function injectLIToDOM(newLI) {
  document.getElementById("ingredient-ol").innerHTML += newLI;
}

function loadIngredientFromStorage() {
  const ingredientsJSON = localStorage.getItem(INGREDIENTS_KEY_NAME);
  if (ingredientsJSON) {
    const ingredients = JSON.parse(ingredientsJSON);
    for (const ingredient of ingredients) {
      const newLI = generateLI(ingredient);
      injectLIToDOM(newLI);
    }
  }
}

function saveIngredientToLocalStorage(ingredient) {
  const ingredientsJSON = localStorage.getItem(INGREDIENTS_KEY_NAME) || "[]";
  const ingredients = JSON.parse(ingredientsJSON);
  ingredients.push(ingredient);
  localStorage.setItem(INGREDIENTS_KEY_NAME, JSON.stringify(ingredients));
}

function clearForm() {
  document.getElementById("ingredients-form").reset();
}

loadIngredientFromStorage();