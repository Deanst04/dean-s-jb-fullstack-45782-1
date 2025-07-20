const students = [
  {
    name: `Dean`,
    grade: 95,
    age: 21,
    gender: `male`,
  },
  {
    name: `Michael`,
    grade: 92,
    age: 36,
    gender: `male`,
  },
  {
    name: `Ruth`,
    grade: 88,
    age: 29,
    gender: `female`,
  },
];

let student;

// native way of find:
const findStudent = name => {
  for (const currentStudent of students) {
    if (currentStudent.name === name) {
      return currentStudent;
    }
  }
  return undefined;
};

console.log(findStudent(`Ruth`));
// the HOF way of find:
console.log(students.find(currentStudent => currentStudent.name === `Ruth`))


// native way of find index
const findStudentIndex = name => {
  for (let i = 0; i < students.length; i++) {
    if (students[i].name === name) {
      return i;
    }
  }
  return undefined;
};

console.log(findStudentIndex(`Ruth`));


// the HOF way of findIndex:
console.log(students.findIndex(currentStudent => currentStudent.name === `Ruth`))

// native way of filter:
const results = [];
const findStudentWithHighGrade = grade => {
  for (const currentStudent of students) {
    if (currentStudent.grade >= grade) {
      results.push(currentStudent);
    }
  }
  return results;
};

console.log(findStudentWithHighGrade(90));

// the HOF way of filter
console.log(students.filter(currentStudent => currentStudent.grade > 90));


// native map:
const mapGrades = grade => {
  const results = [];
  for (const currentStudent of students) {
      results.push(currentStudent.grade);
  }
  return results;
};

console.log(mapGrades(students));

// the HOF way:
console.log(students.map(currentStudent => currentStudent.grade))
console.log(students.map(currentStudent => currentStudent.name))
console.log(students.map(currentStudent => { return {name: currentStudent.name, grade: currentStudent.grade}}))

// just a loop: 
const loopStudents = students => {
  for (const currentStudent of students) {
      console.log(currentStudent);
  }
};

loopStudents(students);

// the HOF way of loop:
console.log(students.forEach((student, i) => console.log(student)));

