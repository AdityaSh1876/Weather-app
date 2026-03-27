const defaultCities = [
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
    { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
];

const weatherCodes = {
    0: { label: "Clear Sky", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    48: { label: "Icy Fog", icon: "🌫️" },
    51: { label: "Light Drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Heavy Drizzle", icon: "🌧️" },
    61: { label: "Light Rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy Rain", icon: "🌧️" },
    71: { label: "Light Snow", icon: "🌨️" },
    73: { label: "Snow", icon: "❄️" },
    75: { label: "Heavy Snow", icon: "❄️" },
    80: { label: "Rain Showers", icon: "🌦️" },
    81: { label: "Showers", icon: "🌧️" },
    82: { label: "Heavy Showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm + Hail", icon: "⛈️" },
    99: { label: "Severe Thunderstorm", icon: "🌩️" },
};

function getWeatherInfo(code) {
    return weatherCodes[code] || { label: "Unknown", icon: "🌡️" };
}

function getWindDirection(degrees) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(degrees / 45) % 8];
}

async function fetchWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature&wind_speed_unit=kmh`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather");
    const data = await res.json();
    return { city: city.name, ...data.current };
}

async function geocodeCity(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error("City not found");
    const r = data.results[0];
    return { name: r.name, lat: r.latitude, lon: r.longitude };
}

function createCard(data) {
    const info = getWeatherInfo(data.weather_code);
    const card = document.createElement("div");
    card.className = "weather-card";
    card.innerHTML = `
        <div class="card-header">
            <span class="city-name">${data.city}</span>
            <span class="weather-icon">${info.icon}</span>
        </div>
        <div class="temperature">${Math.round(data.temperature_2m)}°C</div>
        <div class="feels-like">Feels like ${Math.round(data.apparent_temperature)}°C</div>
        <div class="condition">${info.label}</div>
        <div class="details">
            <div class="detail">
                <span class="detail-icon">💧</span>
                <span>${data.relative_humidity_2m}%</span>
                <span class="detail-label">Humidity</span>
            </div>
            <div class="detail">
                <span class="detail-icon">💨</span>
                <span>${Math.round(data.wind_speed_10m)} km/h</span>
                <span class="detail-label">Wind ${getWindDirection(data.wind_direction_10m)}</span>
            </div>
        </div>
    `;
    return card;
}

function showLoading(msg) {
    document.getElementById("loading").textContent = msg;
}

function hideLoading() {
    document.getElementById("loading").textContent = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(city, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchWeather(city);
        } catch (e) {
            if (i < retries - 1) await sleep(500);
        }
    }
    return null;
}

async function loadDefaultCities() {
    showLoading("Loading weather data...");
    const grid = document.getElementById("weatherGrid");
    grid.innerHTML = "";

    const results = await Promise.all(defaultCities.map(city => fetchWithRetry(city)));

    results.forEach(data => {
        if (data) grid.appendChild(createCard(data));
    });

    hideLoading();
}

document.getElementById("searchBtn").addEventListener("click", async () => {
    const input = document.getElementById("cityInput").value.trim();
    if (!input) return;

    showLoading(`Searching for "${input}"...`);

    try {
        const city = await geocodeCity(input);
        const data = await fetchWeather(city);
        const grid = document.getElementById("weatherGrid");

        const existing = [...grid.querySelectorAll(".city-name")].find(
            el => el.textContent.toLowerCase() === city.name.toLowerCase()
        );

        if (existing) {
            existing.closest(".weather-card").scrollIntoView({ behavior: "smooth" });
        } else {
            const card = createCard(data);
            card.classList.add("highlight");
            grid.prepend(card);
            card.scrollIntoView({ behavior: "smooth" });
        }

        document.getElementById("cityInput").value = "";
    } catch (e) {
        showLoading(`City not found. Please try another name.`);
        setTimeout(hideLoading, 3000);
        return;
    }

    hideLoading();
});

document.getElementById("cityInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("searchBtn").click();
});

loadDefaultCities();
