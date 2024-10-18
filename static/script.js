// Get references to HTML elements
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "b190a0605344cc4f3af08d0dd473dd25"; // Your OpenWeatherMap API key

// Function to create weather cards (current day and future days)
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.date})</h2>
                    <h6>Temperature: ${weatherItem.temperature}°C</h6>
                    <h6>Wind: ${weatherItem.wind} M/S</h6>
                    <h6>Humidity: ${weatherItem.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.description}</h6>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>(${weatherItem.date})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${weatherItem.temperature}°C</h6>
                    <h6>Wind: ${weatherItem.wind} M/S</h6>
                    <h6>Humidity: ${weatherItem.humidity}%</h6>
                </li>`;
    }
}

// Fetch and display weather details
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // Prepare weather data to send to backend
            const weatherData = fiveDaysForecast.map(weatherItem => ({
                date: weatherItem.dt_txt.split(" ")[0],
                temperature: (weatherItem.main.temp - 273.15).toFixed(2),
                wind: weatherItem.wind.speed,
                humidity: weatherItem.main.humidity,
                description: weatherItem.weather[0].description,
                icon: weatherItem.weather[0].icon
            }));

            // Send data to Flask backend for MongoDB storage
            fetch("/store_weather", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ location: cityName, days_weather: weatherData })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(() => {
                alert("An error occurred while storing the weather data!");
            });

            // Clear previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Display weather cards in the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherData[index], index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
}

// Get city coordinates from the OpenWeatherMap Geo API
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get city coordinates (latitude, longitude) from the API response
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

// Get user's current location coordinates using geolocation API
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
}

// Event listeners for buttons and form submissions
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
