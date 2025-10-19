"use strict";

(async () => {

    
    const getData = url => fetch(url).then(result => result.json())

    const fetchUsers = () => getData(`https://jsonplaceholder.typicode.com/users`)
    const fetchUser = id => getData(`https://jsonplaceholder.typicode.com/users/${id}`)

    const generateUsersHTML = users => {
        const html = users
            .map(({id, name}) => `
                <option value="${id}">${name}</option>
            `).join(``)
            return `<option value="0" selected disabled>please choose a user</option>
            ${html}`
    }

    const generateUserHTML = ({ name, username, email, phone ,address : { street, city, zipcode }, company}) => 
            `
                <p><strong>name: </strong>${name}</p>
                <p><strong>user name: </strong>${username}</p>
                <p><strong>email: </strong>${email}</p>
                <p><strong>phone: </strong>${phone}</p>
                <p><strong>city: </strong>${city}</p>
                <p><strong>street: </strong>${street}</p>
                <p><strong>zip code: </strong>${zipcode}</p>
                <p><strong>company name: </strong>${company.name}</p>
            `

    const renderHTML = (html ,target) => document.getElementById(target).innerHTML = html

    const renderUsersHTML = html => renderHTML(html, "users-select")
    const renderUserHTML = html => renderHTML(html, "user-data")
    
    document.getElementById("users-select").addEventListener(`change`, async () => {

        try {
            const user = await fetchUser(+document.getElementById("users-select").value)
            const html = generateUserHTML(user)
            renderUserHTML(html)
            console.log(`user ${+document.getElementById("users-select").value} chosen`)
        } catch (err) {
            console.log(err)
        }
    })

    try {
        const users = await fetchUsers()
        const html = generateUsersHTML(users)
        renderUsersHTML(html)
    } catch (err) {
        console.log(err)
    }

})()