"use strict";

(() => {

    const myGrades = new Set()

    // set is a collection
    // much like an array
    myGrades.add(90)
    myGrades.add(96)
    myGrades.add(72)
    console.log(myGrades)

    // set can only hold UNIQUE values
    myGrades.add(72)
    console.log(myGrades)

    // for performance consideration: set functions work with O(1)
    console.log([90, 96, 72])
    console.log(`the grade 96 is present in the Set? ${myGrades.has(96)}`)

    // here is an array:
    const grades = [78, 82, 88, 88, 90, 92, 92, 96, 96, 96, 96, 99]

    // create an array from grades with only uniques values
    console.log(
        grades.reduce((acc, currGrade) => {
        const current = [...acc]
        const isInArray = current.includes(currGrade)
        if (!isInArray) current.push(currGrade)

        return current
    }, [])
    )

    // use Set to do same in a single command!
    // clues:
    // 1. a set can be initiated with an array e.g. const mySet = new Set(myArray) 
    // 2. ...

    const uniqueArr = [...new Set(grades)] // the elegant way to unique an array in javascript
    console.log(uniqueArr)

})()