const dean = {
    name: `dean`,
    city: `petah tikva`,
    grades: [90, 95, 100],
};

const oz = {
    name: `oz`,
    city: `petah tikva`,
    grades: [100, 89, 93],
};

const shaked = {
    name: `shaked`,
    city: `petah tikva`,
    grades: [88, 90, 93],
};

const students = [dean, oz, shaked];


let sum = 0;
let count = 0;

for (const student of students) {
    for (const grade of student.grades) {
        // console.log(grade);
        sum += grade;
        count++
    }
}
console.log(`the average is: ${parseInt((sum / count))}`);

