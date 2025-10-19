ADDRESS_KEY_NAME = "address"

function addAddress(event) {
    event.preventDefault();
    const data = collectDataFromForm();
    const ifValid = validateData(data);
    if (!ifValid) return;
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

function validateData(data) {
  document.getElementById("city").style.backgroundColor = "";
  document.getElementById("street").style.backgroundColor = "";
  document.getElementById("house-number").style.backgroundColor = "";
  document.getElementById("zip-code").style.backgroundColor = "";
  
  if (document.getElementById("city").value === `` &&
     document.getElementById("street").value === `` &&
     document.getElementById("house-number").value === `` &&
     document.getElementById("zip-code").value === `` ) {
      alert(`No information was captured. Please fill in all fields.`);
      document.getElementById("city").style.backgroundColor = "red";
      document.getElementById("street").style.backgroundColor = "red";
      document.getElementById("house-number").style.backgroundColor = "red";
      document.getElementById("zip-code").style.backgroundColor = "red";
      return false;
     }

     let isValid = true;

     if (data.city === ``) {
      alert(`Missing information in the city field`);
      document.getElementById("city").style.backgroundColor = "red";
      isValid = false;
     }

     if (data.street === ``) {
      alert(`Missing information in the street field`);
      document.getElementById("street").style.backgroundColor = "red";
      isValid = false;
     }

     if (data.houseNumber === ``) {
      alert(`Missing information in the house number field`);
      document.getElementById("house-number").style.backgroundColor = "red";
      isValid = false;
     }

     if (data.zipCode === ``) {
      alert(`Missing information in the zip code field`);
      document.getElementById("zip-code").style.backgroundColor = "red";
      isValid = false;
     }
     return isValid;
}