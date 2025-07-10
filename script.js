"use strict";

const toggleDiv = document.querySelector("#toggleDiv");
const viewLogs = document.querySelector("#viewLogs");
const formDiv = document.querySelector("#formDiv");
const form = document.querySelector("form");
///////////////////////////////////////////////////////
// Inputs

const inputType = document.querySelector("#inputType");
const inputDistance = document.querySelector("#inputDistance");
const inputDuration = document.querySelector("#inputDuration");
const inputCadence = document.querySelector("#inputCadence");
const inputElevation = document.querySelector("#elevation");

/////////////////////////////////////////////////////
// Global Map Variables
let map, mapEvent;

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

  const coords = [5.4885544, 7.0606007];

  console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

  map = L.map("map").setView(coords, 13);

  console.log(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // This shows the form
  map.on("click", function (mapE) {
    mapEvent = mapE;
    formDiv.classList.remove("hidden");
    inputDistance.focus();
  });
};

navigator.geolocation.getCurrentPosition(GotLocation, ErrorFun);

///////////////////////////////////////////////
// Now this now shows the marker

form.addEventListener("submit", function (e) {
  e.preventDefault();
  //Clear Input fields
  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      "";

  console.log(mapEvent);

  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 200,
        minWidth: 100,
        maxHeight: 40,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("workout")
    .openPopup();
});

///////////////////////////////////////////
// Event listener for which form to display
inputType.addEventListener("change", function () {
  inputCadence.closest("#cadence").classList.toggle("flex");
  inputCadence.closest("#cadence").classList.toggle("hidden");
  inputElevation.closest("#elevation").classList.toggle("flex");
  inputElevation.closest("#elevation").classList.toggle("hidden");
});
// console.log(GetPosition);
