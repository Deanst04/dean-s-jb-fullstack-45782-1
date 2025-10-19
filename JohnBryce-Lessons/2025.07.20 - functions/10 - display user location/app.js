const showUserLocation = () => {
  navigator.geolocation.getCurrentPosition(position => { 
    console.log('inside success callback')
    console.log(position)
  }, error => {
    console.log('inside error callback')
    console.log(error);
  })
  console.log(`immediately after invoking getCurrentLocation`)
  
}

showUserLocation();