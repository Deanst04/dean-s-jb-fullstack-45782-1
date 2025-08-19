enum Countries {
    israel = `israel`,
    usa = `usa`,
    portugal = `portugal`
}

interface Person {
    name: string,
    age: number,
    eyeColor: string
    country: Countries
}

const ido: Person = {
    name: `ido`,
    age: 22,
    eyeColor: `black`,
    country: Countries.israel
}

const dean: Person = {
    name: `dean`,
    age: 21,
    eyeColor: `brown`,
    country: Countries.portugal
}

console.log(dean)

// document.getElementById(`countries`).innerHTML = 

console.log(Object.keys(Countries))