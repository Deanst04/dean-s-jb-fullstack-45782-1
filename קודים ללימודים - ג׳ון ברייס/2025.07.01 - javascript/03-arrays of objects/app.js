const ido = {
    name: `ido`,
    gender: `male`,
    age: 20,
    city: `rosh haayin`,
};

const lior = {
    name: `lior`,
    gender: `male`,
    age: 24,
    city: `arsuf ilit`,
};

const itay = {
    name: `itay`,
    gender: `male`,
    age: 30,
    city: `haifa`,
};

const students = [ido, lior, itay];

for (const student of students) {
    console.log(`iterating ${student.name}:`);
    for (const prop in student) {
        console.log(`${prop}: ${student[prop]}`);
    }
}