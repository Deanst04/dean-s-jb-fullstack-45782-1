let grade = +prompt(`please enter a grade`)

if (grade >= 0 && grade <= 59) alert(`נכשל`)
else if (grade >= 60 && grade <= 69) alert(`מספיק`)
else if (grade >= 70 && grade <= 79) alert(`כמעט טוב`)
else if (grade >= 80 && grade <= 89) alert(`טוב`)
else if (grade >= 90 && grade <= 99) alert(`טוב מאוד`)
else if (grade === 100) alert(`מעולה`)