const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Function to fetch weather based on city name or coordinates
async function getWeather(city = null, lat = null, lon = null) {
    const apiKey = '383875bb0757abb610673f5b2e734cfd'; // Replace with your actual API key
    let url;

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        document.getElementById('weather').innerHTML = `Location not provided`;
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            weather_body.style.display = "flex";
            temperature.innerHTML = `${Math.round(data.main.temp)}°C`;
            description.innerHTML = `${data.weather[0].description}`;

            humidity.innerHTML = `${data.main.humidity}%`;
            wind_speed.innerHTML = `${data.wind.speed}Km/H`;

            switch(data.weather[0].main){
                case 'Clouds':
                    weather_img.src = "https://github.com/user-attachments/assets/1bdd2b16-9cfc-40cb-844e-ef78e4bef2e3";
                    break;
                case 'Clear':
                    weather_img.src = "https://github.com/user-attachments/assets/aafb3a78-b16e-4339-a531-01982f2027d3";
                    break;
                case 'Rain':
                    weather_img.src = "https://github.com/user-attachments/assets/2854e6dc-4d61-463a-b3fc-c45657934738";
                    break;
                case 'Mist':
                    weather_img.src = "https://github.com/user-attachments/assets/10e707a4-0e0e-4579-98da-b1f93bdec3a2";
                    break;
                case 'Snow':
                    weather_img.src = "https://github.com/user-attachments/assets/bc552a04-c9a5-4477-9461-f2b8312e2c36";
                    break;
            }
            

            // Update background based on weather description
            const weatherMain = data.weather[0].main.toLowerCase();
            updateBackground(weatherMain);

            // Save to history
            addToHistory(data.name, data.main.temp, data.weather[0].description);
        } else {
            document.getElementById('weather').innerHTML = `${data.message}`;
        }
    } catch (error) {
        document.getElementById('weather').innerHTML = `Error fetching weather data`;
    }
}

// Function to detect user's location and fetch weather
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeather(null, latitude, longitude);
            },
            (error) => {
                document.getElementById('weather').innerHTML = `Location access denied. Please enter a city name.`;
            }
        );
    } else {
        document.getElementById('weather').innerHTML = `Geolocation not supported by this browser.`;
    }
}

// Event listener for button click to get weather based on city input
function getWeatherByCity() {
    const city = document.getElementById('city').value;
    // Clear any previous error message
    document.getElementById('weather').innerHTML = '';
    getWeather(city);
}

// Function to add weather data to the history section
function addToHistory(city, temp, description) {
    const historyContainer = document.getElementById('history');
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = `
        ${city}
        ${temp}°C, ${description}
    `;
    historyContainer.prepend(historyItem); // Add new items at the top
}

// Function to update background based on weather condition
function updateBackground(weatherMain) {
    if (weatherMain.includes("clear")) {
        document.body.style.background = "linear-gradient(to right, #FFD194, #70E1F5)";
    } else if (weatherMain.includes("cloud")) {
        document.body.style.background = "linear-gradient(to right, #D7DDE8, #757F9A)";
    } else if (weatherMain.includes("rain")) {
        document.body.style.background = "linear-gradient(to right, #2C3E50, #4CA1AF)";
    } else if (weatherMain.includes("snow")) {
        document.body.style.background = "linear-gradient(to right, #E6DADA, #274046)";
    } else if (weatherMain.includes("thunderstorm")) {
        document.body.style.background = "linear-gradient(to right, #141E30, #243B55)";
    } else if (weatherMain.includes("mist") || weatherMain.includes("fog")) {
        document.body.style.background = "linear-gradient(to right, #3E5151, #DECBA4)";
    } else {
        document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
    }
    document.body.style.backgroundSize = "cover";
}
