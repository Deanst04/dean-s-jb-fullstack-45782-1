const salaries = [12000, 13000, 20000, 9800, 10000, 23000, 11000, 21000, 22000, 30000];


let sum = 0
let max = 0
for (const salary of salaries) {
  console.log(salary);
  sum += salary
  max = salary >= max ? salary : max;
}

console.log(`the average salary is: ${sum / salaries.length}`)
console.log(`the highest salary is: ${max}`)
