const grades = [
    [30, 50, 100],
    [90, 80, 200],
    [400, 10, 60],
];

let sum = 0;
for (const studentsGrades of grades) {
    for (const grade of studentsGrades) {
        sum+=grade;
    }
};
console.log(sum);