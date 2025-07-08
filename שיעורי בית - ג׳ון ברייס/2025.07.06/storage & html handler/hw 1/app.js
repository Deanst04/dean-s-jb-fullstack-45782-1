ADDRESS_KEY_NAME = "address"

function addAddress(event) {
    event.preventDefault();
    const data = collectDataFromForm();
    saveDataToLocalStorage(data);
    alert(`address saved!`);
    clearForm();
}

function collectDataFromForm() {
    const city = document.getElementById("city").value; 
    const street = document.getElementById("street").value; 
    const houseNumber = document.getElementById("house-number").value; 
    const zipCode = document.getElementById("zip-code").value; 

    return {
        city,
        street,
        houseNumber,
        zipCode,
    };
}

function saveDataToLocalStorage(data) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(ADDRESS_KEY_NAME, dataJSON);
}

function loadData() {
  const addressJSON = localStorage.getItem(ADDRESS_KEY_NAME);
  if (addressJSON) { alert(`loading address....`);
  const data = JSON.parse(addressJSON);
     document.getElementById("city").value = data.city; 
     document.getElementById("street").value = data.street; 
     document.getElementById("house-number").value = data.houseNumber; 
     document.getElementById("zip-code").value = data.zipCode; 
  }
}

function clearForm() {
    document.getElementById("address-form").reset();
}