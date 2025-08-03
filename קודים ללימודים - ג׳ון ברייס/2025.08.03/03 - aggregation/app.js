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
      .map(({ firstName, lastName, image }, index) => `<tr><td>${firstName} ${lastName}</td><td><img src="${image}"></td></tr>`)
      .join(``)
      return html
  }

  const getAverageWeight = users => users.reduce((acc, { weight }) => acc + weight, 0) / users.length


  const generateRolesHTML = users => users.reduce((cumulative, { role }) => {
        const currentRole = cumulative.find(({ theRole }) => theRole === role)
        if (!currentRole) cumulative.push({
            theRole: role,
            count: 1
        })
        else currentRole.count += 1
        return cumulative
    }, []).map(({ theRole, count }) => `
        <tr>
            <td>${theRole}</td>
            <td>${count}</td>
        </tr>
    `)
   


  const generateStatsHTML = users => 
    `<p>total: <span>${users.length}</span></p>
    <p>average weight: <span>${getAverageWeight(users)}</span></p>
    <table>
        ${generateRolesHTML(users)}
    </table>
  `

  // renderHTML (generate output)

  const renderHTML = (html, target) => document.getElementById(target).innerHTML = html

  const renderUserHTML = html => renderHTML(html, "users-names-images")
  const renderStatsHTML = html => renderHTML(html, "total")

      
  // main
  const users = await fetchUsers()
  const html = generateUsersHTMl(users)
  renderUserHTML(html)

  const stats = generateStatsHTML(users)
  renderStatsHTML(stats)

})()
