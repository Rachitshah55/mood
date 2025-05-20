console.log("Stage 1 layout loaded");

function updateTime() {
    const timeBox = document.getElementById('timeBox');
    
    function refreshTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        timeBox.textContent = `Local time: ${hours}:${minutes}:${seconds} — Timezone: ${timezone}`;
    }
    
    // Update immediately and then every second
    refreshTime();
    setInterval(refreshTime, 1000);
}

function getWeather() {
    const weatherBox = document.getElementById('weatherBox');
    const apiKey = "your_api_key_here"; // Placeholder for API key
    const city = "New York";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    // Show loading state
    weatherBox.textContent = 'Loading weather data...';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            return response.json();
        })
        .then(data => {
            const temperature = Math.round(data.main.temp);
            const condition = data.weather[0].main;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            
            // Clear the loading text
            weatherBox.textContent = '';
            
            // Create and add weather icon image
            const iconImg = document.createElement('img');
            iconImg.src = iconUrl;
            iconImg.alt = condition;
            iconImg.className = 'weather-icon';
            
            // Create and add temperature and condition text
            const weatherText = document.createElement('span');
            weatherText.textContent = `${temperature}°C — ${condition}`;
            
            // Add elements to weatherBox
            weatherBox.appendChild(iconImg);
            weatherBox.appendChild(weatherText);
        })
        .catch(error => {
            weatherBox.textContent = `Error: ${error.message}`;
            console.error('Weather fetch error:', error);
        });
}

// Call functions on page load
updateTime();
getWeather(); 