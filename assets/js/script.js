// Element values
const citySearchInput = document.querySelector('#city-search');
const searchButtonEl = document.querySelector('.search-btn');

const currentWeatherEl = document.querySelector('.current-weather-container');
const cityDay = document.querySelector('.city-name-date');
const buttonsContainerEl = document.querySelector('.new-buttons');

const forecastContainerEl = document.querySelector('.five-day-container');
const weatherCardsContainerEl = document.querySelector('.forecast-container');

// Add weather info through p elements
let temp = document.createElement('p');
let wind = document.createElement('p');
let humidity = document.createElement('p');
let uvi = document.createElement('p');
let description = document.createElement('p');

// Current date
let currentDate = moment().format('M/DD/YYYY');

// Global local storage value -- if nothing stored, make an empty array
let storedCities = JSON.parse(localStorage.getItem('storedCities')) || [];

// API key for OpenWeather fetches
const API_KEY = '1fd353df9a65fba742aece36f28e320a';

// * DISPLAY PERSISTING CITY BUTTONS
function displayButtons() {

   // Check and get local storage array before saving
   storedCities = JSON.parse(localStorage.getItem('storedCities')) || [];

   // Traverse through stored cities backwards (most recently searched shows first)
   for (i = storedCities.length - 1; i >= 0; i--) {
      // Create a new button element
      var cityButton = document.createElement('button');
      // Set classes, id, and text
      cityButton.classList = 'btn city-btn';
      cityButton.textContent = storedCities[i];
      // Append the button to the container
      buttonsContainerEl.append(cityButton);
   };
};

// * CREATE A PERSISTENT CITY BUTTON FROM NEW SEARCH
function createButton(city) {
   // Create a new button 
   var newCityButton = document.createElement('button');
   newCityButton.classList = 'btn city-btn';
   // Label it with its city
   newCityButton.textContent = city;
   // Append the button to its container
   buttonsContainerEl.append(newCityButton);

   // Pass the city to the fetch function
   fetchCoordinates(city);
   // Clear search input on page
   citySearchInput.value = '';
}

// * DISPLAY SEARCHED CITY NAME AND SAVE TO LOCAL STORAGE
function getCityInfo(event) {
   event.preventDefault();

   // Clear current city title and forecast
   cityDay.textContent = '';
   forecastContainerEl.innerText = '';
   weatherCardsContainerEl.innerText = '';
   // Get the input value submitted
   var city = citySearchInput.value.trim();
   // Check for valid input 
   if (!city) {
      alert(`You didn't enter anything. Give it another go.`);
      return;
   }

   // Check and get local storage array before saving
   storedCities = JSON.parse(localStorage.getItem('storedCities')) || [];
   // Save city to local storage
   storedCities.push(city);
   storedCities = localStorage.setItem('storedCities', JSON.stringify(storedCities));

   // Create a button for the city to persist on the page
   createButton(city);
};

// ! Get info from local storage and display persistent buttons
displayButtons();

// ! Get city info on search button click
searchButtonEl.addEventListener('click', getCityInfo);

// ! Search city already stored on existing city button
$(document).on('click', '.city-btn', function (event) {
   // Clear current city title and forecast
   cityDay.textContent = '';
   forecastContainerEl.innerText = '';
   weatherCardsContainerEl.innerText = '';
   // Display the date and the city and fetch the coordinates
   var storedCity = event.target.textContent;
   cityDay.textContent = `${storedCity} (${currentDate})`;
   fetchCoordinates(storedCity);
});