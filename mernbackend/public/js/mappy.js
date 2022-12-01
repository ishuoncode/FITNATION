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
let ids = null;

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
        const id = Math.floor(Math.random() * 8745632478 + 1);

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

const work = function () {
  fetch("http://localhost:3000/api/mappy/workouts")
    .then(async (res) => {
      const val = await res.json();
      ids = val;
      //// render marker/////
      for (i = 0; i <= val.length; i++) {
        L.marker([val[i].latitude, val[i].longitude])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: `${val[i].type}-popup`,
            })
          )
          .setPopupContent(
            `${val[i].type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${val[i].type} on ${
              val[i].month
            } ${val[i].date} `
          )
          .openPopup();

        let html = `
          <div class="direction">
         
            <li class="workout workout--${val[i].type}" data-id="${val[i].identity}">
             
              <h2 class="workout__title">${val[i].type} on ${val[i].month} ${val[i].date} 

              <form  id="formss" action="/mappy/delete" method="post" >
  <input type="text" class="unique" name="unique" value="${val[i].identity}"/>
  <button id="submit" type="submit" style="cursor:pointer;"><img src="css/img/trash-outline.svg" alt="" style="height:20px; width=20px;  " class="icon"></button>
</form>
            </h2>
              
             
         
              
              
              <div class="workout__details">
               <span class="workout__icon"> 🏃‍♂️ </span>
                <span class="workout__value">${val[i].distance}</span>
              <span class="workout__unit">Km</span>
             </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${val[i].duration}</span>
            <span class="workout__unit">min</span>
              </div>`;
        if (val[i].type === "running") {
          html += ` <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${val[i].pace}</span>
                 <span class="workout__unit">min/km</span>
               </div>
               <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${val[i].cadence}</span>
                <span class="workout__unit">spm</span>
              </div>
                </li>`;
        }
        if (val[i].type === "cycling") {
          html += `<div class="workout__details">
                 <span class="workout__icon">⚡️</span>
                 <span class="workout__value">${val[i].speed}</span>
                  <span class="workout__unit">km/h</span>
              </div>
              <div class="workout__details">
                 <span class="workout__icon">⛰</span>
                 <span class="workout__value">${val[i].elevgain}</span>
                 <span class="workout__unit">m</span>
                </div>
              </li> `;
        }
        form.insertAdjacentHTML("afterend", html);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
work();

containerWorkouts.addEventListener("click", function (e) {
  const workoutEl = e.target.closest(".workout");
  if (!workoutEl) return;

  const workoutID = parseInt(workoutEl.dataset.id);
  const data = ids.filter((id) => id.identity === workoutID)[0];
  console.log(data);

  map.setView([data.latitude, data.longitude], 13, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
});

const formss= document.getElementById("formss");
const unique= document.querySelectorAll(".unique");
