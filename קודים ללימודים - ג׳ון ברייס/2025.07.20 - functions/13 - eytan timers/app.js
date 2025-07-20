let didRespond = false;

navigator.geolocation.getCurrentPosition(p => {
  didRespond = true
}, p => {
  didRespond = false
})

setTimeout(() => {
  console.log(didRespond ? `responded` : `did not respond`)
}, 5 * 1000)