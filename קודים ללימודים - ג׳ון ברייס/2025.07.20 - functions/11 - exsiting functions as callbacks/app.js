const showUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    console.log,
    console.log
  );
  console.log(`immediately after invoking getCurrentLocation`);
};

showUserLocation();
