"use strict";

(async () => {
    
    const getData = url => fetch(url).then(result => result.json())

    const fetchUsers = async () => {
        const { users } = await getData(`https://dummyjson.com/users`)
        return users
    }

    const generateUsersHTML = users => {
        const html = users
            .map(({firstName, lastName, email, image}) => 
            `
            <tr>
                 <td class="text-center align-middle">${firstName}</td>
                 <td class="text-center align-middle">${lastName}</td>
                 <td class="text-center align-middle">${email}</td>
                 <td class="text-center align-middle"><img src="${image}"></td>
            </tr>
        `).join(``)
        return html
    }

    const renderUsersHTML = html => {
        document.getElementById("users-table").innerHTML = html
    }

             
    addEventListener(`DOMContentLoaded`, async () => {

        try {
            const users = await fetchUsers()
            const html = generateUsersHTML(users)
            renderUsersHTML(html)
            console.log(`done!`)
        } catch (err) {
            console.log(err)
        }
    })

})()