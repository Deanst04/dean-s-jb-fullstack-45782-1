const myCat = {
  name: `lichi`,
  age: 1,
  color: `grey and white`,
  isSterile: true,
};

const myCatJson = JSON.stringify(myCat);
alert(myCatJson);

const yourCat = JSON.parse(myCatJson);
console.log(yourCat);
console.log(typeof yourCat.isSterile); // testing typeof

for (const prop in yourCat) {
  if (typeof yourCat[prop] === `boolean`) {
    document.write(`Is Sterile: ${yourCat[prop]}`);
  } else {
    document.write(
      `${prop[0].toUpperCase()}${prop.substring(1)}: ${yourCat[prop]} <br>`
    );
  }
}
