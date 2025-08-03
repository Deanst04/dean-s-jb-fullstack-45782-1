"use strict";

(async () => {
    
    const getData = url => fetch(url).then(result => result.json())

    const fetchUsers = async () => {
        const { users } = await getData(`https://dummyjson.com/users`)
        return users
    }

    const generateUsersHTML = users => {
         const monthDistribution = Object.entries(
            users.reduce((acc, { birthDate }) => {
            const currentBirthDateMonth = new Date(birthDate).getMonth() + 1
            if (acc[currentBirthDateMonth]) acc[currentBirthDateMonth] += 1
            else acc[currentBirthDateMonth] = 1
            return acc
        }, {})
        ).map(([month, count]) => ({month, count}))
        .sort((a, b) => b.count - a.count)

        return monthDistribution.map(({month, count}) => `
            <tr>
                <td>${month}</td>
                <td>${count}</td>
            </tr>
        `).join(``)
    }

    const renderUsersHTML = html => {
        document.getElementById("users-table").innerHTML = html
    }

    try {
        const users = await fetchUsers()
        const html = generateUsersHTML(users)
        renderUsersHTML(html)
        console.log(`done!`)
    } catch (err) {
        console.log(err)
    }

    // the sort func checks 2 numbers (a, b), if we want an acceding order we use arr.sort((a, b) => a - b),
    //  if a - b is negative, its means that a is smaller, and if we want an descending order we use arr.sort((a, b) => b - a),
    // if b - a is positive, it means that b is larger than a
    // the sort function "splits" every duo in the array into one array, for example [1, 2, 3, 4, 5, 6],
    // the sort will "split" the array like this [1, 2, 3], [4, 5, 6], then it split it into: [1], [2, 3], [4], [5, 6] until we got this: [1], [2], [3], [4], [5], [6]
    // so the sort spiting the array log2n and because the sort is working on n elements thats make the complexity: O(n log2n)
})()