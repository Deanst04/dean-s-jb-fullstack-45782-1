const worker = {
  firstName: ``,
  lastName: ``,
//  object inside an object
//  // name: {
  //   first: ``,
  //   last: ``,
  // },
  salary: ``,
};

worker.firstName = prompt(`please enter your first name`)
worker.lastName = prompt(`please enter your last name`)
worker.salary = +prompt(`please enter your salary`)

console.log(
  `the employee name is: ${worker.firstName} ${worker.lastName}
   and he earns: ${worker.salary} nis per month`
  );

worker.address = prompt(`please enter your home address`)

delete worker.lastName

for (const prop in worker) {
  console.log(`${prop}: ${worker[prop]}`);
}