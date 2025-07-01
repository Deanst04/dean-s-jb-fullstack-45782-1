const website = prompt(`please enter a url of a site`);

let siteEnding = website.substring(website.indexOf(`.`) + 1);
console.log(siteEnding);

if (siteEnding === `com`) {
  document.write(`The website is an international commercial site.`);
} else if (siteEnding === `org`) {
  document.write(`The website is an international organizational site.`);
} else if (siteEnding === `co.il`) {
  document.write(`The website is an Israeli commercial site.`);
} else if (siteEnding === `org.il`) {
  document.write(`The website is an Israeli organizational site.`);
} else if (siteEnding === `gov.il`) {
  document.write(`The website is an Israeli governmental site.`);
} else document.write(`This website is from another type`);