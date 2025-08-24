const students = [
  `Dean`,
  `Shahar`,
  `Yarden`,
  `Lihi`,
  `Golan`,
  `Ido`,
  `Yossi`,
  `Arthur`,
  `Lior`,
]

const newStudentsArray = students.reduce((acc, student) => `${acc} ${student}`, ``)
console.log(newStudentsArray);

// reduce for strings

const studentsString = students.join(` `);
console.log(studentsString);
const studentsString2 = studentsString.split(` `).join(`-`);
console.log(studentsString2);
