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

function getWeather(params = {}) {
    const weatherBox = document.getElementById('weatherBox');
    const apiKey = "your_api_key_here"; // Placeholder for API key
    let apiUrl;
    
    // Show loading state
    weatherBox.textContent = 'Loading weather data...';
    
    // Determine which API endpoint to use based on provided parameters
    if (params.lat !== undefined && params.lon !== undefined) {
        // Use coordinates-based API
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}&units=metric`;
    } else if (params.city) {
        // Use city-based API
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(params.city)}&appid=${apiKey}&units=metric`;
    } else {
        // Default to New York if no parameters provided
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=New%20York&appid=${apiKey}&units=metric`;
    }
    
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
            const cityName = data.name;
            
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
            
            // Create location text
            const locationText = document.createElement('div');
            locationText.textContent = cityName;
            locationText.className = 'location-text';
            
            // Add elements to weatherBox
            weatherBox.appendChild(iconImg);
            weatherBox.appendChild(weatherText);
            weatherBox.appendChild(locationText);
        })
        .catch(error => {
            weatherBox.textContent = `Error: ${error.message}`;
            console.error('Weather fetch error:', error);
        });
}

function setupLocationDetection() {
    const detectLocationBtn = document.querySelector('.search-section button');
    const cityInput = document.querySelector('.search-section input');
    
    // Event listener for the "Detect My Location" button
    detectLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            detectLocationBtn.textContent = 'Detecting...';
            detectLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getWeather({ lat, lon });
                    detectLocationBtn.textContent = 'Detect My Location';
                    detectLocationBtn.disabled = false;
                },
                // Error callback
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                        default:
                            errorMessage = 'Unknown location error';
                    }
                    
                    const weatherBox = document.getElementById('weatherBox');
                    weatherBox.textContent = `Error: ${errorMessage}. Please enter a city manually.`;
                    detectLocationBtn.textContent = 'Detect My Location';
                    detectLocationBtn.disabled = false;
                    console.error('Geolocation error:', error);
                },
                // Options
                { timeout: 10000 }
            );
        } else {
            const weatherBox = document.getElementById('weatherBox');
            weatherBox.textContent = 'Error: Geolocation is not supported by your browser. Please enter a city manually.';
        }
    });
    
    // Event listener for city input (when user presses Enter)
    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && cityInput.value.trim() !== '') {
            getWeather({ city: cityInput.value.trim() });
        }
    });
}

// Call functions on page load
updateTime();
getWeather(); // Default to New York on initial load
setupLocationDetection(); 