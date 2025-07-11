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
const inputElevation = document.querySelector("#inputElevation");

/////////////////////////////////////////////////
// Input Containers (cadence & elevation )
const elevationDiv = document.querySelector("#elevation");
const cadenceDiv = document.querySelector("#cadence");

// Side bar Toggle
toggleDiv.addEventListener("click", (e) => {
  viewLogs.classList.toggle("p-4");
  viewLogs.classList.toggle("w-0");
  viewLogs.classList.toggle("w-fit");
});

const ErrorFun = () => {
  alert("Could not get your position");
};

///////////////////////////////////////////////

class Workout {
  date = new Date();
  id = (new Date() + "").slice(-10)

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

///////////////////////////////////////////
// Creating Class for Workout Class

class OpenApp {
  #map;
  #mapEvent;

  constructor() {
    this.#getPosition();
    form.addEventListener("submit", this.#newWorkout.bind(this));
    inputType.addEventListener("change", this.#toggleElevationField);
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        this.#ErrorFun
      );
    }
  }

  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);

    const coords = [5.4885544, 7.0606007];

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    console.log(this);
    this.#map = L.map("map").setView(coords, 13);

    // console.log(this.#map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords)
      .addTo(this.#map)
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
      .setPopupContent("Current Location")
      .openPopup();

    // This shows the form
    this.#map.on("click", this.#showForm.bind(this));
  }

  #ErrorFun() {
    alert("Could not get your position");
  }
  #showForm(mapE) {
    this.#mapEvent = mapE;
    formDiv.classList.remove("hidden");
    inputDistance.focus();
  }

  #toggleElevationField() {
    cadenceDiv.classList.toggle("flex");
    cadenceDiv.classList.toggle("hidden");
    elevationDiv.classList.toggle("flex");
    elevationDiv.classList.toggle("hidden");
  }

  #newWorkout(e) {
    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
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

    //Clear Input fields
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";

    inputCadence.blur();
    inputDistance.blur();
    inputDuration.blur();
    inputElevation.blur();
  }
}

////////////////////////////////////////////////////
// Creating an instance app

const App = new OpenApp();
