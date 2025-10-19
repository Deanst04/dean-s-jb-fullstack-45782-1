const PETS_KEY_NAME = "pets";

function addPet(event) {
  event.preventDefault(); // prevent form submission
  const data = collectDataFromForm();
  const newTR = generateTR(data);
  injectTRToDOM(newTR);
  savePetsToLocalStorage(data);
  clearForm();
}

function collectDataFromForm() {
  const pet = document.getElementById("pet-type").value;
  const petName = document.getElementById("pet-name").value;
  const petAge = document.getElementById("pet-age").value;
  const petImageURL = document.getElementById("pet-image").value;

  return {
    pet,
    petName,
    petAge,
    petImageURL,
  };
}

function generateTR(data) {
  const newTR = `
        <tr >
            <td class="align-middle">${data.pet}</td>
            <td class="align-middle">${data.petName}</td>
            <td class="align-middle">${data.petAge}</td>
            <td><img src="${data.petImageURL}"></td>
        </tr>
    `;
  return newTR;
}

function injectTRToDOM(newTR) {
  document.getElementById("pet-list").innerHTML += newTR;
}

function loadPetsFromStorage() {
  const petsJSON = localStorage.getItem(PETS_KEY_NAME);
  if (petsJSON) {
    const pets = JSON.parse(petsJSON);
    for (const pet of pets) {
      const newTR = generateTR(pet);
      injectTRToDOM(newTR);
    }
  }
}

function savePetsToLocalStorage(pet) {
  const petsJSON = localStorage.getItem(PETS_KEY_NAME) || "[]";
  const pets = JSON.parse(petsJSON);
  pets.push(pet);
  localStorage.setItem(PETS_KEY_NAME, JSON.stringify(pets));
}

function clearForm() {
  document.getElementById("pets-form").reset();
}

loadPetsFromStorage();