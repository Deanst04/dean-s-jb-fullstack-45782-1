"use strict";

(async () => {

    const getData = url => fetch(url).then(result => result.json())

    const fetchUser = id => getData(`https://jsonplaceholder.typicode.com/users/${id}`)

    const generateUserHTML = ({name, username, email, phone ,address : { street, city, zipcode }, company}) => 
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
    

    const renderUserHTML = html => {
        document.getElementById("user-data").innerHTML = html
    }

    document.getElementById("get-user-data").addEventListener(`click`, async () => {
        
        const userId = +document.getElementById("user-id").value

        if (userId > 10 || userId < 1) {
            alert(`please choose a number between 1 - 10`)
            return
        }

        try {
            const user = await fetchUser(userId)
            const html = generateUserHTML(user)
            renderUserHTML(html)
        } catch (err) {
            console.log(err)
        }
    })
    
})()

                

