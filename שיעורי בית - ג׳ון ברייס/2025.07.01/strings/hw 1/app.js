const website = prompt(`please enter a url of a site`);

if (website.lastIndexOf(`.`) === 0 || website.lastIndexOf(`.`) === -1) {
  document.write(`your input is invalid`);
} else if (website.endsWith(`com`)) {
  console.log(`com`);
  document.write(`The website is an international commercial site.`);
} else if (website.endsWith(`org`)) {
  console.log(`org`);
  document.write(`The website is an international organizational site.`);
} else if (website.endsWith(`co.il`)) {
  console.log(`co.il`);
  document.write(`The website is an Israeli commercial site.`);
} else if (website.endsWith(`org.il`)) {
  console.log(`org.il`);
  document.write(`The website is an Israeli organizational site.`);
} else if (website.endsWith(`gov.il`)) {
  console.log(`gov.il`);
  document.write(`The website is an Israeli governmental site.`);
} else {
  const lastDot = website.lastIndexOf(`.`);
  const beforeLastDot = website.lastIndexOf(`.`, lastDot - 1);
  if (beforeLastDot !== -1) {
    console.log(website.substring(beforeLastDot + 1));
    document.write(`This website is from another type`);
  } else {
    console.log(website.substring(lastDot + 1));
    document.write(`This website is from another type`);
  }
}

// if indexOf(`something`) isn`t exist, the index of the something is -1