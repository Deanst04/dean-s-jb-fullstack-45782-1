"use strict";

(async () => {

    
    const getData = url => fetch(url).then(res => res.json())
    
    const fetchUsers = async () => {
        const users = await getData(`https://jsonplaceholder.typicode.com/users`)
        return users
    }

    const generateUserSelect = users => {
        const usersSelect = users.map(({ id, name }) => 
        `<option value="${id}">${name}</option>`).join(``);
        document.getElementById("users-select").innerHTML += usersSelect
    }

    const users = await fetchUsers()
    generateUserSelect(users)

    document.getElementById("users-select").addEventListener(`change`, async () => {
        const userID = document.getElementById("users-select").value

        const generateUserHTML = user => {
        const { name, username, email, phone ,address : { street, city, zipcode }, company} = user
        const html = 
                `
                    <li>full name: ${name}</li>
                    <li>username: ${username}</li>
                    <li>email: ${email}</li>
                    <li>TEL: ${phone}</li>
                    <li>city: ${city}</li>
                    <li>street: ${street}</li>
                    <li>zipcode: ${zipcode}</li>
                    <li>company name: ${company.name}</li>
                `
        return html
    }


    try {
        const user = await getData(`https://jsonplaceholder.typicode.com/users/${userID}`)
        const html = generateUserHTML(user)
        document.getElementById("users-info").innerHTML = html
        console.log(`success, user ${userID} selected`)
    } catch (err) {
        console.log(err)
    }
    })

})()