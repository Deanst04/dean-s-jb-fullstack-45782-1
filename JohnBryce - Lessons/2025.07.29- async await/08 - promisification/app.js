"use strict";

(async () => {

  const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

  try {
    const geo = await getUserLocation()
    console.log(geo)
  } catch (err) {
    console.log(err)
  }
  

})()
