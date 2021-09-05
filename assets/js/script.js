//global variables
var searchCityEl = document.getElementById("searchCity");
var cityHeadingEl = document.querySelector(".cityNameDate");
var apiKey = "&appid=b1753ec59a219420447810a8ba1a0092";

var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

//display searched cities
function displaySearchedCities() {
    for(i = 0; i < searchedCities.length; i++) {
        var searchedCityListEl = document.createElement("li");
        searchedCityListEl.classList = "searchedCity";
        var searchedCityBtn = document.createElement("button");
        searchedCityBtn.classList = "btn cityBtn";
        searchedCityBtn.textContent = searchedCities[i];
        searchedCityListEl.appendChild(searchedCityBtn);
        $(".searchedCitiesList").append(searchedCityListEl);
    }
}
//display current city, date, and weather
function getCity(city) {
    var date = moment().format("MM/DD/YYYY");
    city = searchCityEl.value.trim() || city;
    cityHeadingEl.textContent = city + " (" + date + ")";

    searchedCities.push(city);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

    var weatherApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + apiKey;

    fetch(weatherApiUrl).then(function(response) {
       if(response.ok) {
        response.json().then(function(data) {
            getCurrentWeather(data);
        });
    } else {
        alert("Please enter a valid city.");
    }
})
    .catch(function(error) {
        alert("Unable to connect to One Call")
    })
}

//current weather
function getCurrentWeather(city) {
    searchCityEl.value = "";
    var latitude = city[0].lat;
    var longitude = city[0].lon;

    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + apiKey; 

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var weatherIconInfo = data.current.weather[0].icon;
                var weatherIconEl = document.createElement("img");
                weatherIconEl.src = "https://openweathermap.org/img/wn/" + weatherIconInfo + ".png";
                cityHeadingEl.appendChild(weatherIconEl);

                var currentTemp = data.current.temp;
                var currentWindSpeed = data.current.wind_speed;
                var currentHumidity = data.current.humidity;
                var currentUvIndex = data.current.uvi;

                var currentUvEl = document.createElement("span");
                currentUvEl.textContent = currentUvIndex;
                if(currentUvIndex <= 2) {
                    currentUvEl.classList = "favorable";
                } else if(currentUvIndex > 2 && currentUvIndex < 6) {
                    currentUvEl.classList = "moderate";
                } else if (currentUvIndex >= 6) {
                    currentUvEl.classList = "severe";
                }

                $(".temp").text("Temp: " + currentTemp + "\u00B0 F"); 
                $(".wind").text("Wind: " + currentWindSpeed + " MPH");
                $(".humidity").text("Humidity: " + currentHumidity + " %");
                $(".uvIndex").text("UV Index: ").append(currentUvEl);

                fiveDayForecast(latitude, longitude);
                addSearchedCity();
                
            })
        } 
    })
    .catch(function(error) {
        alert("Unable to connect to One Call")
    });
}
//display 5-day forecast
function fiveDayForecast(latitude, longitude){
    $(".forecast").html("<h3 class='forecastHeading'>5-Day Forecast:</h3>");
    var forecastApiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts" + "&units=imperial" + apiKey; 
    fetch(forecastApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var dailyArray = data.daily;

                for(i = 1; i < 6; i++) {
                    var forecastDay = document.createElement("div");
                    forecastDay.classList = "forecastDay col";
                    $(".forecast").append(forecastDay);
                    var unixDate = data.daily[i].dt;
                    var dateToShow = moment.unix(unixDate).format("MM/DD/YYYY");
                    var dayDateEl = document.createElement("h4");
                    dayDateEl.classList = "dailyForecastDate";
                    dayDateEl.textContent = dateToShow;
                    forecastDay.appendChild(dayDateEl);

                    //weather icon
                    var dailyIcon = data.daily[i].weather[0].icon;
                    var dailyIconEl = document.createElement("img");
                    dailyIconEl.src = "https://openweathermap.org/img/wn/" + dailyIcon + ".png";
                    forecastDay.appendChild(dailyIconEl);

                    //temperature
                    var dailyTemp = document.createElement("p");
                    dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + "\u00B0 F";
                    forecastDay.appendChild(dailyTemp);

                    //wind
                    var dailyWind = document.createElement("p");
                    dailyWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                    forecastDay.appendChild(dailyWind);
                    
                    //humidity
                    var dailyHumidity = document.createElement("p");
                    dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
                    forecastDay.appendChild(dailyHumidity);
                }
            })
        }
    })
}
//searched cities
function addSearchedCity() {
       var lastSearchedCityList = document.createElement("li")
       lastSearchedCityList.classList = "searchedCity";
       var lastSearchedCityBtn = document.createElement("button");
       lastSearchedCityBtn.classList = "btn cityBtn";
       lastSearchedCityBtn.textContent = searchedCities[searchedCities.length - 1];
       lastSearchedCityList.appendChild(lastSearchedCityBtn);
       $(".searchedCitiesList").append(lastSearchedCityList);
}

$(".searchBtn").on("click", getCity);
$(document).on("click", ".cityBtn", function() {
    var btnCity = event.target.textContent
    getCity(btnCity);
})
displaySearchedCities();