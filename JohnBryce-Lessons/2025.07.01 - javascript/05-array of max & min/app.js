const dean = {
    name: `dean`,
    city: `petah tikva`,
    grades: [90, 95, 100],
};

const oz = {
    name: `oz`,
    city: `petah tikva`,
    grades: [98, 89, 93],
};

const shaked = {
    name: `shaked`,
    city: `petah tikva`,
    grades: [88, 90, 93],
};

const students = [dean, oz, shaked];


let max = 0;
let min = 100;
let maxStudent, minStudent;

for (const student of students) {
    for (const grade of student.grades) {
        if (grade > max) {
            max = grade
            maxStudent = student.name;
        }
        if (grade < min) {
            min = grade
            minStudent = student.name;
        }
    }
}

console.log(`max is ${max} by ${maxStudent}, min is ${min} by ${minStudent}`);
