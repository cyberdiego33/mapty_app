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
// Creating Class for the Workout data

class Workout {
  date = new Date().toDateString();
  id = (Date.now() + "").slice(-5);

  constructor(coords, distance, duration) {
    this.coords = coords; // An array of [lat, lng]
    this.distance = distance;
    this.duration = duration;

    console.log( this.id);
    console.log(`Where is my ID`);
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
  }
  
  calcPace() {
    this.pace = this.duration / this.distance
    return this.pace
  }
}

class Cyclying extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration)
    this.elevationGain = elevationGain
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60)
    return this.speed
  }
}

// const testRunning = new Running([4.8472226, 6.974604], 49, 38, 68)
// const CyclyingTest = new Cyclying([4.8472226, 6.974604], 38, 82, 39)

///////////////////////////////////////////
// Creating Class for Map Functionality

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

    if (viewLogs.classList.contains("w-0")) {
      viewLogs.classList.add("p-4", "w-fit");
      viewLogs.classList.remove("w-0");
    }
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

    if (viewLogs.classList.contains("w-fit")) {
      viewLogs.classList.remove("p-4", "w-fit");
      viewLogs.classList.add("w-0");
    }
  }
}

////////////////////////////////////////////////////
// Creating an instance app

const App = new OpenApp();
