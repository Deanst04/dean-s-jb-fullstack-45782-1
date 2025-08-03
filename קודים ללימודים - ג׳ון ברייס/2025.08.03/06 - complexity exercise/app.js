"use strict";

(async () => {
  const getData = (url) => fetch(url).then((result) => result.json());

  const fetchUsers = async () => {
    const { users } = await getData(`https://dummyjson.com/users`);
    return users;
  };

  const users = await fetchUsers();

  console.log(

    Object.entries(
      users.reduce((cumulative, { eyeColor }) => {
        if (cumulative[eyeColor]) cumulative[eyeColor] += 1;
        else cumulative[eyeColor] = 1;
        return cumulative;
      }, {})
    )
    .map(([color, count]) => ({ color, count}))
  );

})();
