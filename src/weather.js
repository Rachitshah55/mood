// Store the interval ID for the time update to clear it later
let timeUpdateIntervalId;

// Modified function to format local time using a timezone offset
export function formatLocalTime(timezoneOffsetInSeconds) {
    // Get the current UTC time in milliseconds
    const nowUtc = Date.now();
    // Add the timezone offset (in milliseconds) to the UTC time
    const localTimestamp = nowUtc + timezoneOffsetInSeconds * 1000;
    const local = new Date(localTimestamp);
    
    const hours = local.getUTCHours().toString().padStart(2, '0');
    const minutes = local.getUTCMinutes().toString().padStart(2, '0');
    const seconds = local.getUTCSeconds().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

// Modified function to get the hour of the day using a timezone offset
export function getTimeOfDay(timezoneOffsetInSeconds) {
    const nowUtc = Date.now(); // Get the current UTC time in milliseconds
    const localTimestamp = nowUtc + timezoneOffsetInSeconds * 1000; // Add the timezone offset (in milliseconds)
    const local = new Date(localTimestamp);
    const hour = local.getUTCHours(); // Use getUTCHours with the adjusted timestamp
    
    if (hour >= 5 && hour < 12) {
        return "morning";
    } else if (hour >= 12 && hour < 17) {
        return "afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "evening";
    } else {
        return "night";
    }
}

export function getWeather(params = {}) {
    const weatherBox = document.getElementById('weatherBox');
    const timeBox = document.getElementById('timeBox');

    // Show loading state
    weatherBox.textContent = 'Loading weather data...';
    // Clear previous time and interval
    timeBox.textContent = '';
    if (timeUpdateIntervalId) {
        clearInterval(timeUpdateIntervalId);
    }


    // Call our Netlify Function instead of OpenWeather directly
    fetch('/.netlify/functions/getWeather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if (!response.ok) {
            // Check for a JSON response even on error to get more details
            return response.json().then(errData => {
                throw new Error(`Weather data not available: ${errData.details || response.statusText}`);
            }).catch(() => { // Handle cases where response is not JSON
                throw new Error(`Weather data not available. Status: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        const temperature = Math.round(data.main.temp);
        const condition = data.weather[0].main;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const cityName = data.name;
        const timezoneOffset = data.timezone; // Get the timezone offset in seconds


        weatherBox.textContent = '';

        const iconImg = document.createElement('img');
        iconImg.src = iconUrl;
        iconImg.alt = condition;
        iconImg.className = 'weather-icon';

        const weatherText = document.createElement('span');
        weatherText.textContent = `${temperature}°C — ${condition}`;

        const locationText = document.createElement('div');
        locationText.textContent = cityName;
        locationText.className = 'location-text';

        weatherBox.appendChild(iconImg);
        weatherBox.appendChild(weatherText);
        weatherBox.appendChild(locationText);

        // Update time box with local time of the location and set up interval
        function updateLocationTime() {
             const localTime = formatLocalTime(timezoneOffset);
             timeBox.textContent = `Local time: ${localTime} — Location: ${data.name}`;
        }
        
        updateLocationTime(); // Update immediately
        timeUpdateIntervalId = setInterval(updateLocationTime, 1000); // Update every second


        // playAmbientSound(condition); // This will be called from app.js after importing

        // Calculate and display mood using the correct time of day for the location
        // const timeOfDay = getTimeOfDay(timezoneOffset); // This will be done in app.js
        // const mood = calculateMood(condition, timeOfDay); // This will be done in app.js
        // const moodBox = document.getElementById('moodBox'); // This will be done in app.js
        // moodBox.textContent = `Mood: ${mood.label} ${mood.emoji} — Score: ${mood.score}/100`; // This will be done in app.js

        // applyMoodTheme(mood.score); // This will be done in app.js

        // Generate visual prompt using the correct time of day
        // const visualPrompt = buildVisualPrompt({
        //     weatherCondition: condition,
        //     cityName: cityName,
        //     localTime: formatLocalTime(timezoneOffset), // Pass the correctly formatted local time string
        //     moodScore: mood.score,
        //     moodLabel: mood.label
        // }); // This will be done in app.js


        // console.log("Generated Visual Prompt:", visualPrompt.fullPrompt); // This will be done in app.js

        // Fetch background image using the generated prompt
        // fetchBackgroundImage(visualPrompt.fullPrompt); // This will be called from app.js

        // Return relevant data for other modules
        return { condition, cityName, timezoneOffset };
    })
    .catch(error => {
        weatherBox.textContent = `Error: ${error.message}`;
        timeBox.textContent = ''; // Clear time on error
        if (timeUpdateIntervalId) {
            clearInterval(timeUpdateIntervalId);
        }
        console.error('Weather fetch error:', error);
        throw error; // Re-throw to allow app.js to handle it
    });
}