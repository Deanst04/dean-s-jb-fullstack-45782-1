"use strict";

( async () => {
    const getData = url => fetch(url).then(result => result.json())

    const fetchUsers = () => getData(`https://jsonplaceholder.typicode.com/users`)

    const fetchUser = id => getData(`https://jsonplaceholder.typicode.com/users/${id}`)


    const generateUsersHTMl = users => {
        const html = users
        .map(({ id, name }) => `
        <option value="${id}">${name}</option>
        `
        ).join(``)
        return html
    }

    const generateUserHTMl = ({ name, email, phone, address: { city }}) => `
        <p><strong>name: </strong> ${name}</p>
        <p><strong>email: </strong> ${email}</p>
        <p><strong>phone: </strong> ${phone}</p>
        <p><strong>city: </strong> ${city}</p>
        `

    const renderHTML = (html, target) => document.getElementById(target).innerHTML = html

    const renderUsersHTML = html => renderHTML(html, `users-select`)
    const renderUserHTML = html => renderHTML(html, `user-details`)

    document.getElementById(`users-select`).addEventListener(`change`, async () => {
        
        try {
            const user = await fetchUser(document.getElementById("users-select").value)
            const html = generateUserHTMl(user)
            renderUserHTML(html)
        } catch (err) {
            console.log(err)
        }
        
    })

    const users = await fetchUsers()
    const html = generateUsersHTMl(users)
    renderUsersHTML(html)
})()