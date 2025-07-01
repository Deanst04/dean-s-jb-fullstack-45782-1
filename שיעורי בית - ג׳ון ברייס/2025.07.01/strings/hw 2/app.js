const file = prompt(`please enter a file`);

const fileEnding = file.substring(file.indexOf(`.`) + 1);
console.log(fileEnding);

if (fileEnding === `jpg`) alert(`your file is an image`);
else if (fileEnding === `jpeg`) alert(`your file is an image`);
else if (fileEnding === `png`) alert(`your file is an image`);
else if (fileEnding === `gif`) alert(`your file is an image`);
else if (fileEnding === `tiff`) alert(`your file is an image`);
else if (fileEnding === `bmp`) alert(`your file is an image`);
else if (fileEnding === `webp`) alert(`your file is an image`);
else alert(`your file is not an image`);