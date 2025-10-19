let num = +prompt(`please enter a number`)

if (num < 0) alert(`the number is negative`)
else if (num === 0) alert(`the number is 0`)
else if (num >= 1 && num <= 100) alert(`the number is between 1-100 inclusive`)
else if (num >= 101 && num <= 1000) alert(`the number is between 101-1000 inclusive`)
else alert(`the number is bigger than 1000`)