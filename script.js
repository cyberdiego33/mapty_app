const toggleDiv = document.querySelector("#toggleDiv");
const viewLogs = document.querySelector("#viewLogs");

// Side bar Toggle
toggleDiv.addEventListener("click", (e) => {
  viewLogs.classList.toggle("p-4");
  viewLogs.classList.toggle("w-0");
  viewLogs.classList.toggle("w-fit");
});

// Geolocation API
///////////////////////////////////////////////////
// Getting the users API

const ErrorFun = () => {
  alert("Could not get your position");
};

const GotLocation = (position) => {
  console.log(position);
  const { latitude, longitude } = position.coords;
  console.log(latitude, longitude);

  const coords = [5.4885544, 7.0606007]

  console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

  const map = L.map("map").setView(coords, 13);

  console.log(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(coords)
    .addTo(map)
    .bindPopup("A pretty CSS popup.<br> Easily customizable.")
    .openPopup();
  
  map.on("click", function(mapEvent) {
    console.log(mapEvent);

    const {lat, lng} = mapEvent.latlng

    L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Workout.")
    .openPopup();

  })
};

navigator.geolocation.getCurrentPosition(GotLocation, ErrorFun);

// console.log(GetPosition);
