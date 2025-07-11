const IMAGES_KEY_NAME = "images";

function addImage(event) {
  event.preventDefault(); // prevent form submission
  const data = collectDataFromForm();
  const newTR = generateTR(data);
  injectTRToDOM(newTR);
  saveImageToLocalStorage(data);
  clearForm();
}

function collectDataFromForm() {
  const image = document.getElementById("image-description").value;
  const imageURL = document.getElementById("image").value;

  return {
    image,
    imageURL,
  };
}

function generateTR(data) {
  const newTR = `
        <tr >
            <td class="align-middle">${data.image}</td>
            <td><img src="${data.imageURL}"></td>
        </tr>
    `;
  return newTR;
}

function injectTRToDOM(newTR) {
  document.getElementById("image-list").innerHTML += newTR;
}

function loadImagesFromStorage() {
  const imagesJSON = localStorage.getItem(IMAGES_KEY_NAME);
  if (imagesJSON) {
    const images = JSON.parse(imagesJSON);
    for (const image of images) {
      const newTR = generateTR(image);
      injectTRToDOM(newTR);
    }
  }
}

function saveImageToLocalStorage(image) {
  const imagesJSON = localStorage.getItem(IMAGES_KEY_NAME) || "[]";
  const images = JSON.parse(imagesJSON);
  images.push(image);
  localStorage.setItem(IMAGES_KEY_NAME, JSON.stringify(images));
  countHowManyImages(images);
}

function clearForm() {
  document.getElementById("image-form").reset();
}

function countHowManyImages(images) {
    if (images.length === 1) document.getElementById("image-number").innerHTML = `You added ${images.length} image`;
    else document.getElementById("image-number").innerHTML = `You added ${images.length} images in total`;
}

function displayHowManyImages() {
  const imagesJSON = localStorage.getItem(IMAGES_KEY_NAME) || "[]";
  const images = JSON.parse(imagesJSON);
  countHowManyImages(images);
}

loadImagesFromStorage();
displayHowManyImages();