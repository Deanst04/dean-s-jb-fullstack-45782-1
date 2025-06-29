const grades = [];

for (let i = 0; i < 10; i++) {
    grades.push(+prompt(`please enter a grade`))
}

for (const grade of grades) {
    if (grade >= 0 && grade <= 100) {
        console.log(`${grade} is a legit grade`);
    } else {
        console.log(`${grade} isn't a legit grade`);
    }
}
