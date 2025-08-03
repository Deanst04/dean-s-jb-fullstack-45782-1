"use strict";

(async () => {

  const getData = url => fetch(url).then(response => response.json())

  // getData (input)
  const fetchTodos = () => getData(`https://dummyjson.com/todos`)

  // generateHTML (process input)
  const generateTodosHTMl = todos => {
    const html = todos.reduce((acc, { userId, completed }) => {
      const current = [...acc]
      const currentUserId = acc.find(current => current.userId === userId)
      if (currentUserId) {
        currentUserId.openTodos += completed ? 0 : 1
        currentUserId.completedTodos += completed ? 1 : 0
      } else {
        current.push({
          userId,
          openTodos: completed ? 0 : 1,
          completedTodos: completed ? 1 : 0,
        })
      }
      return current
    }, []).map(({ userId, openTodos, completedTodos}) => `
        <tr>
          <td>${userId}</td>
          <td>${openTodos}</td>
          <td>${completedTodos}</td>
        </tr>
      `).join(``)
      
    return html
  }


  // renderHTML (generate output)

  const renderHTML = (html, target) => document.getElementById(target).innerHTML = html
  const renderTodosHTML = html => renderHTML(html, "users-tasks")

      
  // main
  const { todos } = await fetchTodos()
  const html = generateTodosHTMl(todos)
  renderTodosHTML(html)

})()
