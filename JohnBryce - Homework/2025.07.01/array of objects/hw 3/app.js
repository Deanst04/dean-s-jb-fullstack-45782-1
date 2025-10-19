const geoLocation = [];

for (let i = 0; i < 3; i++) {
  let latitude = prompt(`please enter a latitude`);
  let longitude = prompt(`please enter a longitude`);
  geoLocation.push({
    latitude: latitude,
    longitude: longitude,
  });
};

for (const location of geoLocation) {
  for (const prop in location) {
    console.log(`${prop}: ${location[prop]}`);
  }
};
