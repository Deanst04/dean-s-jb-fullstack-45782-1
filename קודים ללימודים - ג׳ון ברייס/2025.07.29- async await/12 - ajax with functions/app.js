"use strict";

(async () => {

  const getData = url => fetch(url).then(response => response.json())

  // getData (input)
  const fetchUsers = async () => {
    const { users } = await getData(`https://dummyjson.com/users`)
    return users
  }

  // generateHTML (process input)
  const generateUsersHTMl = users => {
    const html = users
      .map(({ firstName, lastName }, index) => `<li>user ${index + 1}: ${firstName} ${lastName}</li>`)
      .join(``)
      return html
  }

  // renderHTML (generate output)
  const renderUserHTML = html => {
    document.getElementById("users-list").innerHTML = html
  }
      
  // main
  const user = await fetchUsers()
  const html = generateUsersHTMl(user)
  renderUserHTML(html)
})()
