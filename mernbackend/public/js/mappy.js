// APPLICATION ARCHITECTURE

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const x = document.getElementById("x");
const y = document.getElementById("y");
const identity = document.getElementById("identity");
const day = document.getElementById("day");
const month = document.getElementById("month");
const types = document.getElementById("types");

let map, mapEvent;

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];

      map = L.map("map").setView(coords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //////handling click on map
      map.on("click", function (mapE) {
        const { lat, lng } = mapE.latlng;
        // get latit and longi for form value
        x.value = lat;
        y.value = lng;
        console.log(x.value, y.value);
        const id = Math.floor(Math.random() * 10000000000000000000000000 + 1);

        identity.value = id;
        //////////////////////////////////
        mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
      });
    },
    function () {
      alert("Could not get your position");
    }
  );
//////////////////

form.addEventListener("submit", function (e) {
  //e.preventDefault(); ///////////band karnana hai isko varna form submit nahi hoga
  const pace = (inputDuration.value / inputDistance.value).toFixed(1);
  const speed = (inputDuration.value / inputDistance.value / 60).toFixed(1);
  types.value = inputType.value;
  console.log(types.value);
  if (
    inputDistance.value < 0 ||
    inputCadence.value < 0 ||
    inputDuration.value < 0 ||
    inputElevation.value < 0
  ) {
    return alert("Input have to be a positive number");
  }
  let html = `
<li class="workout workout--${inputType.value}" data-id=${identity.value}>
 <h2 class="workout__title">${inputType.value} on ${month.value} ${
    day.value
  } </h2>
 <div class="workout__details">
   <span class="workout__icon">${
     inputType.value === "running" ? "🏃‍♂️" : "🚴‍♀️"
   }</span>
   <span class="workout__value">${inputDistance.value}</span>
   <span class="workout__unit">km</span>
 </div>
 <div class="workout__details">
   <span class="workout__icon">⏱</span>
   <span class="workout__value">${inputDuration.value}</span>
   <span class="workout__unit">min</span>
 </div>`;

  if (inputType.value === "running") {
    html += ` <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${pace}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${inputCadence.value}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;
  }
  if (inputType.value === "cycling") {
    html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${speed}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${inputElevation.value}</span>
    <span class="workout__unit">m</span>
  </div>
</li> -->`;
  }
  form.insertAdjacentHTML("afterend", html);

  form.style.display = "none";
  form.classList.add("hidden");
  setTimeout(() => (form.style.display = "grid"), 1000);
  //display marker
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${inputType.value}-popup`,
      })
    )
    .setPopupContent(
      `${inputType.value === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${inputType.value} on ${
        month.value
      } ${day.value} `
    )
    .openPopup();
});
inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});

const date = new Date();

day.value = date.getDate();
const mon = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
month.value =
  mon[date.getMonth()].charAt(0).toUpperCase() + mon[date.getMonth()].slice(1);
