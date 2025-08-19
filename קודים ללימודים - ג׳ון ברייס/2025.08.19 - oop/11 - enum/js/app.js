var Countries;
(function (Countries) {
    Countries["israel"] = "israel";
    Countries["usa"] = "usa";
    Countries["portugal"] = "portugal";
})(Countries || (Countries = {}));
const ido = {
    name: `ido`,
    age: 22,
    eyeColor: `black`,
    country: Countries.israel
};
const dean = {
    name: `dean`,
    age: 21,
    eyeColor: `brown`,
    country: Countries.portugal
};
console.log(dean);
// document.getElementById(`countries`).innerHTML = 
console.log(Object.keys(Countries));
