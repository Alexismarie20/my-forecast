const apiKey = "d63c94d7fd2888ac814ff5e6fb5c5f17";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("windSpeed");
const localTimeElement = document.getElementById("localTime");


  return weatherConditions[description.toLowerCase()] || "🌍"; // Default emoji if no match

searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    fetchWeather(location);
  }
});

function fetchWeather(location) {
  const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
     
     if (data.cod !== 200) {
       descriptionElement.textContent = "Location not found. Try again.";
       return;
     }

const weatherDescription = data.weather[0].description;
const weatherEmoji = getWeatherEmoji(weatherDescription);

descriptionElement.textContent = `${weatherEmoji} ${weatherDescription}`;

locationElement.textContent = data.name;
temperatureElement.textContent = `${Math.round(data.main.temp)}°F`;
descriptionElement.textContent = data.weather[0].description;
humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
windSpeedElement.textContent = `Wind Speed: ${Math.round(
      data.wind.speed
    )} mph`;

const utcNow = new Date(); 
const localTime = new Date(utcNow.getTime() + data.timezone * 1000);


localTimeElement.textContent = `Local Time: ${localTime.toLocaleTimeString(
  "en-US",
  { hour: "2-digit", minute: "2-digit", hour12: true }
)}`;
})
.catch((error) => {
  console.error("Error fetching weather data:", error);
});
}

function getWeatherEmoji(description) {
  const weatherConditions = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "⛅",
    "broken clouds": "🌥️",
    "overcast clouds": "☁️",
    "shower rain": "🌧️",
    rain: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
  };
  return weatherConditions[description.toLowerCase()] || "🌍";
}

  