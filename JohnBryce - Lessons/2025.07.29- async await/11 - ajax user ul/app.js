"use strict";

(async () => {

  const getData = url => fetch(url).then(response => response.json())

  // getData (input)
  const { users } = await getData(`https://dummyjson.com/users`)
  console.log(users)

  // generateHTML (process input)
  const fullName = () => {
    users.map(({ firstName, lastName }, index) => {
      document.getElementById("users-list").innerHTML += `<li>user ${index + 1}: ${firstName} ${lastName}</li>`
    })
  }
      
  fullName()
})()
