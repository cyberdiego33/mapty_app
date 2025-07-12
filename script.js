"use strict";

const toggleDiv = document.querySelector("#toggleDiv");
const viewLogs = document.querySelector("#viewLogs");
const formDiv = document.querySelector("#formDiv");
const form = document.querySelector("form");
const LogsContainaer = document.querySelector("#LogsContainaer");
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
  month = new Date().getMonth();
  date = new Date().getDate();
  id = (Date.now() + "").slice(-5);

  constructor(coords, distance, duration) {
    this.coords = coords; // An array of [lat, lng]
    this.distance = distance;
    this.duration = duration;

    // console.log(this.id);
    // console.log(`Where is my ID`);
  }

  _setDescription(type) {
    // prettier-ignore
    const ArrayOfMonth = ["Jan", "Feb", 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.description = `${
      this.type === "running" ? "🏃‍♂️" : "🚴‍♂️"
    } ${type} on ${ArrayOfMonth[this.month]} ${this.date}`;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription("Running");
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cyclying extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription("Cycling");
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////////
// Creating Class for Map Functionality

class OpenApp {
  #map;
  #mapEvent;
  #WorkoutList = [];

  constructor() {
    this.#getPosition();
    form.addEventListener("submit", this.#newWorkout.bind(this));
    inputType.addEventListener("change", this.#toggleElevationField);
    LogsContainaer.addEventListener("click", this.#MoveToPopup.bind(this))
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        this.#ErrorFun
      );
    }
  }

  #renderMarker(workout) {
    console.log(workout);

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          maxHeight: 40,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
  }

  #AddWorkOuts(workout) {
    let string = `<div id="log-${workout.id}"
                      class="workoutDiv p-5 bg-[#42484d] border-l-3 ${
                        workout.type === "running"
                          ? "border-green-400"
                          : "border-yellow-400"
                      } rounded-sm mb-4" data-id="${workout.id}">
                      <h4 class="text-lg font-bold text-white">${
                        workout.description
                      }</h4>
                      <div class="flex text-sm space-x-2">
                        <div class="uppercase text-gray-300">
                          ${
                            workout.type === "running" ? "🏃‍♂️" : "🚴‍♂️"
                          } <span class="text-white font-semibold">${
      workout.distance
    }</span>
                          <span class="text-[10px]">km</span>
                        </div>
                        <div class="uppercase text-gray-300">
                          ⏱ <span class="text-white font-semibold">${
                            workout.duration
                          }</span> <span class="text-[10px]">MIN</span>
                        </div>
                    `;
    /////////////////////////////////////////////////////
    // Appending the remaining html for Running
    if (workout.type === "running") {
      string += ` 
                        <div class="uppercase text-gray-300">
                          ⚡ <span class="text-white font-semibold">${workout.pace.toFixed(
                            1
                          )}</span>
                          <span class="text-[10px]">min/km</span>
                        </div>
                        <div class="uppercase text-gray-300">
                          🦶 <span class="text-white font-semibold">${
                            workout.cadence
                          }</span>
                          <span class="text-[10px]">spm</span>
                        </div>
                      </div>
                    </div>
      `;
    }

    // Appending the remaining html for Cycling
    if (workout.type === "cycling") {
      string += ` 
                        <div class="uppercase text-gray-300">
                          ⚡ <span class="text-white font-semibold">${workout.speed.toFixed(
                            1
                          )}</span>
                          <span class="text-[10px]">km/h</span>
                        </div>
                        <div class="uppercase text-gray-300">
                          🌄 <span class="text-white font-semibold">${
                            workout.elevationGain
                          }</span>
                          <span class="text-[10px]">m</span>
                        </div>
                      </div>
                    </div>
      `;
    }

    LogsContainaer.insertAdjacentHTML("afterbegin", string);
  }

  #loadMap(position) {
    const { latitude, longitude } = position.coords;

    const options = {
      coords: [latitude, longitude],
      description: "Current Location",
      type: "running",
      id: "404"
    };

    // const coords = [5.4885544, 7.0606007];

    // How to create a google map link
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    this.#map = L.map("map").setView(options.coords, 13);

    // console.log(this.#map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#renderMarker(options);

    const dateOptions = {
      weekday: "long",
      day: "2-digit",
      month: "short"
    }
    const Presentdate = new Intl.DateTimeFormat(navigator.language, dateOptions).format(new Date())

    const HtmlString = `
                        <div id="log" data-id="404"
              class="workoutDiv p-5 bg-[#42484d] border-l-3 border-green-400 rounded-sm mb-4"
            >
              <h4 class="text-lg font-bold text-white">Current Location on </h4>
              <p class="text-white">${Presentdate}</p>
            </div>
    `
    LogsContainaer.insertAdjacentHTML("beforeend", HtmlString)
    this.#WorkoutList.push(options)

    // This shows the form
    inputType.value = "running";
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

  #hideForm() {
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
    formDiv.classList.add("hidden");
  }

  #toggleElevationField() {
    cadenceDiv.classList.toggle("flex");
    cadenceDiv.classList.toggle("hidden");
    elevationDiv.classList.toggle("flex");
    elevationDiv.classList.toggle("hidden");
  }

  #newWorkout(e) {
    e.preventDefault();

    // lat and lng
    const { lat, lng } = this.#mapEvent.latlng;

    // Get data from form
    const distanceVal = +inputDistance.value;
    const durationVal = +inputDuration.value;
    const inputTypeVal = inputType.value;
    let newWorkout;

    // Check if date is valid
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const AllPositive = (...inputs) => inputs.every((inp) => inp > 0);

    // If wourkout running, create running object
    if (inputTypeVal === "running") {
      const cadenceVal = +inputCadence.value;

      if (
        !validInputs(distanceVal, durationVal, cadenceVal) ||
        !AllPositive(distanceVal, durationVal, cadenceVal)
      )
        alert("Inputs have to be positive numbers");

      newWorkout = new Running(
        [lat, lng],
        distanceVal,
        durationVal,
        cadenceVal
      );
    }

    // If workout cyclying, create cyclying object
    if (inputTypeVal === "cycling") {
      const elevationVal = +inputElevation.value;

      if (
        !validInputs(distanceVal, durationVal, elevationVal) ||
        !AllPositive(distanceVal, durationVal)
      )
        alert("Inputs have to be positive numbers");

      newWorkout = new Cyclying(
        [lat, lng],
        distanceVal,
        durationVal,
        elevationVal
      );
    }

    // Add new object workout array
    this.#WorkoutList.push(newWorkout);

    // Render workout on map as marker
    this.#renderMarker(newWorkout);

    // Render workout on List
    this.#AddWorkOuts(newWorkout);

    this.#hideForm();
  }

  #MoveToPopup(e) {
    const clickedEl = e.target.closest(".workoutDiv")
    if (!clickedEl) return 
    // console.log(clickedEl);

    const workoutElement = this.#WorkoutList.find(el => el.id === clickedEl.dataset.id) 
    // console.log(workoutElement);

    this.#map.setView(workoutElement.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      }
    })
  }

}

////////////////////////////////////////////////////
// Creating an instance app

const App = new OpenApp();
