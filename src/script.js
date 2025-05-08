const apiKey = "d63c94d7fd2888ac814ff5e6fb5c5f17";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// 🌍 DOM Elements
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const searchResultElement = document.getElementById("searchResult");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("windSpeed");
const localTimeElement = document.getElementById("localTime");
const weatherEmojiElement = document.getElementById("weatherEmoji");
const weatherTextElement = document.getElementById("weatherText");
const hourlyForecastElement = document.getElementById("hourlyForecast");

// 🚀 Search Event Listener
searchButton.addEventListener("click", () => {
  const location = locationInput.value.trim();

  if (!location) {
    searchResultElement.textContent = "Please enter a location!";
    return;
  }

  searchResultElement.classList.add("fade-in");
  searchResultElement.textContent = `Weather in ${location}`;

  fetchWeather(location);
  fetchForecast(location);
});

// 📌 Fetch Current Weather with Caching
function fetchWeather(location) {
  fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        descriptionElement.textContent = "Location not found. Try again.";
        return;
      }

      updateWeatherUI(data);
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

// ⏳ Fetch Weather Forecast
function fetchForecast(location) {
  fetch(`${forecastApiUrl}?q=${location}&appid=${apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.list || data.list.length === 0) {
        console.error("No forecast data available.");
        return;
      }
      updateForecast(data.list);
    })
    .catch((error) => console.error("Error fetching forecast data:", error));
}

// 🌦️ Update Weather UI
function updateWeatherUI(data) {
  locationElement.textContent = data.name;
  temperatureElement.textContent = `${Math.round(data.main.temp)}°F`;
  descriptionElement.textContent = data.weather[0].description;
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeedElement.textContent = `Wind Speed: ${Math.round(
    data.wind.speed
  )} mph`;

  // 🌍 Local Time Conversion
  const localTime = new Date(Date.now() + data.timezone * 1000);
  localTimeElement.textContent = `Local Time: ${localTime.toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit", hour12: true }
  )}`;

  // 🌤️ Apply Weather Background
  setWeatherBackground(data.weather[0].description);
}

// 🌤️ Update Forecast UI
function updateForecast(forecastData) {
  hourlyForecastElement.innerHTML = "";

  forecastData.slice(0, 5).forEach((item) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
    const temp = Math.round(item.main.temp);
    const icon = getWeatherIcon(item.weather[0].id);

    const forecastItem = document.createElement("p");
    forecastItem.innerHTML = `${time}: ${icon} ${temp}°F`;
    forecastItem.classList.add("fade-in");
    hourlyForecastElement.appendChild(forecastItem);
  });
}

// 🎭 Get Weather Icon
function getWeatherIcon(iconCode) {
  return `<i class="wi wi-owm-${iconCode}"></i>`;
}

// 🌈 Set Background Based on Weather
function setWeatherBackground(description) {
  const body = document.body;
  const colors = {
    clear: "#FFD700",
    cloud: "#C0C0C0",
    rain: "#4682B4",
    snow: "#ADD8E6",
    default: "#60AB91",
  };

  let colorKey =
    Object.keys(colors).find((key) => description.includes(key)) || "default";
  body.style.transition = "background-color 1s ease-in-out";
  body.style.backgroundColor = colors[colorKey];
}
