const weatherContainer = document.querySelector(".weather-container");

const weatherIcons = ['☀️', '☃️', '❄️', '☔', '🌤️', '🌩️', '☁️', '🌥️'];

for (let i = 0; i < 50; i++) {
    const weatherElement = document.createElement("div");
    weatherElement.className = 'weather-icon';

    weatherElement.innerText = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];

    weatherElement.style.left = `${Math.random() * 100}vw`;
    weatherElement.style.animationDuration = `${Math.random() * 3 + 3}s`;
    weatherElement.style.animationDelay = `${Math.random() * 3}s`;

    weatherContainer.appendChild(weatherElement);
}
