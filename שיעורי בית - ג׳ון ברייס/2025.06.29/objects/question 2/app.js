const worker = {
    firstName: `dean`,
    lastName: `stark`,
    salary: 12000,
    email: `deanstark04@gmail.com`,
    phone: `0584621006`
}

console.log(worker);

for (const prop in worker) {
    console.log(`${prop}: ${worker[prop]}`);
}