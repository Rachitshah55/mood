console.log("Stage 1 layout loaded");

// Country facts map
const countryFacts = {
    "United States": "The United States has more public libraries than McDonald's restaurants.",
    "India": "India is home to the world's largest postal network.",
    "Japan": "In Japan, slurping noodles is considered polite.",
    "France": "France has over 1,500 types of cheese.",
    "Brazil": "Brazil is named after a tree.",
    "Australia": "Australia is wider than the moon.",
    "Canada": "Canada has more lakes than the rest of the world combined.",
    "China": "The Great Wall of China is not visible from space with the naked eye.",
    "United Kingdom": "The UK issues passports in the name of 'Her Majesty' or 'His Majesty'.",
    "Germany": "Germany has over 1,500 different types of sausages.",
    "Italy": "Italy has more World Heritage sites than any other country.",
    "South Korea": "In South Korea, babies are considered one year old at birth.",
    "Russia": "Russia has 11 different time zones."
};

// Language-based greetings
const greetings = {
    "en": "Hello",
    "es": "Hola",
    "fr": "Bonjour",
    "de": "Hallo",
    "it": "Ciao",
    "hi": "Namaste",
    "ja": "Konnichiwa",
    "zh": "Nǐ hǎo",
    "pt": "Olá",
    "ar": "Marhaba"
};

// Enable ambient sound after first user interaction (click)
document.addEventListener('click', () => {
    const audio = document.getElementById('ambientAudio');
    if (audio && audio.paused) {
        try {
            audio.play();
        } catch (e) {
            console.warn('Audio autoplay blocked (click):', e);
        }
    }
}, { once: true });

// Enable ambient sound after first user interaction (touch - for mobile)
document.addEventListener('touchstart', () => {
    const audio = document.getElementById('ambientAudio');
    if (audio && audio.paused) {
        try {
            audio.play();
        } catch (e) {
            console.warn('Autoplay blocked (touch):', e);
        }
    }
}, { once: true });

function applyMoodTheme(score) {
    // Define theme colors based on mood score ranges
    let color1, color2, textColor;
    
    if (score >= 80) {
        // Happy - Warm yellow + sky blue
        color1 = '#fef08a';
        color2 = '#60a5fa';
        textColor = '#333333';
    } else if (score >= 60) {
        // Chill - Orange + lavender
        color1 = '#fdba74';
        color2 = '#c4b5fd';
        textColor = '#333333';
    } else if (score >= 40) {
        // Neutral - Soft gray + pale blue
        color1 = '#e4e7ec';
        color2 = '#c5d5e5';
        textColor = '#333333';
    } else if (score >= 20) {
        // Low - Navy + muted purple
        color1 = '#1e3a8a';
        color2 = '#7c3aed';
        textColor = '#ffffff';
    } else {
        // Sad - Dark gray + black
        color1 = '#374151';
        color2 = '#1f2937';
        textColor = '#ffffff';
    }
    
    // Apply the theme colors using CSS variables
    document.body.style.setProperty('--color1', color1);
    document.body.style.setProperty('--color2', color2);
    document.body.style.setProperty('--text-color', textColor);
}

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

function formatLocalTime(timezoneOffsetInSeconds) {
    const local = new Date(Date.now() + timezoneOffsetInSeconds * 1000);
    const timeStr = local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return timeStr;
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    
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

function calculateMood(weatherCondition, timeOfDay) {
    let score = 50; // Default middle score
    let label = "Neutral";
    let emoji = "😐";
    
    // Base scores for weather conditions
    const weatherScores = {
        'Clear': 40,
        'Clouds': 10,
        'Rain': -20,
        'Drizzle': -10,
        'Snow': 0,
        'Thunderstorm': -30,
        'Mist': -5,
        'Fog': -10,
        'Haze': -5
    };
    
    // Base scores for time of day
    const timeScores = {
        'morning': 20,
        'afternoon': 30,
        'evening': 10,
        'night': -10
    };
    
    // Add weather and time scores
    score += (weatherScores[weatherCondition] || 0);
    score += (timeScores[timeOfDay] || 0);
    
    // Special combinations
    if (weatherCondition === 'Clear' && timeOfDay === 'afternoon') {
        score += 10; // Sunny afternoon bonus
    } else if (weatherCondition === 'Rain' && timeOfDay === 'night') {
        score -= 5; // Rainy night penalty
    } else if (weatherCondition === 'Clear' && timeOfDay === 'night') {
        score += 5; // Clear night with stars
    }
    
    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    // Determine mood label and emoji based on score
    if (score >= 80) {
        label = "Excellent";
        emoji = "😁";
    } else if (score >= 70) {
        label = "Great";
        emoji = "😊";
    } else if (score >= 60) {
        label = "Good";
        emoji = "🙂";
    } else if (score >= 50) {
        label = "Chill";
        emoji = "😌";
    } else if (score >= 40) {
        label = "Meh";
        emoji = "😐";
    } else if (score >= 30) {
        label = "Low";
        emoji = "😕";
    } else if (score >= 20) {
        label = "Bad";
        emoji = "😔";
    } else {
        label = "Gloomy";
        emoji = "😞";
    }
    
    return {
        score,
        label,
        emoji
    };
}

function playAmbientSound(weatherCondition) {
    const soundBox = document.getElementById('soundBox');
    const audioEl = document.getElementById('ambientAudio');
    
    // Map weather conditions to sound files
    const soundMap = {
        'Clear': './assets/sounds/birds.mp3',
        'Clouds': './assets/sounds/wind.mp3',
        'Rain': './assets/sounds/rain.mp3',
        'Snow': './assets/sounds/snow.mp3',
        'Thunderstorm': './assets/sounds/storm.mp3'
    };
    
    // Default to 'Clear' if the weather condition is not mapped
    const soundFile = soundMap[weatherCondition] || './assets/sounds/birds.mp3';
    
    // Set audio source
    audioEl.src = soundFile;
    audioEl.loop = true;
    
    // Try to play the audio (may fail due to autoplay restrictions)
    try {
        const playPromise = audioEl.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Audio playback failed:', error);
                soundBox.innerHTML = '<p>Click anywhere to enable ambient audio</p>';
                
                // Add a click event listener to the document to enable audio when the user interacts
                document.addEventListener('click', () => {
                    audioEl.play().catch(e => console.error('Play failed even after click:', e));
                }, { once: true });
            });
        }
    } catch (error) {
        console.error('Audio playback error:', error);
        soundBox.innerHTML = '<p>Click anywhere to enable ambient audio</p>';
    }
}

const apiKey = "my_api_key"; // openweathermap.org api key 

function getWeather(params = {}) {
    const weatherBox = document.getElementById('weatherBox');
    
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
            
            // Update time box with local time of the location
            const timeBox = document.getElementById('timeBox');
            const localTime = formatLocalTime(data.timezone);
            timeBox.textContent = `Local time: ${localTime} — Location: ${data.name}`;
            
            // Play ambient sound based on weather condition
            playAmbientSound(condition);
            
            // Calculate and display mood
            const timeOfDay = getTimeOfDay();
            const mood = calculateMood(condition, timeOfDay);
            const moodBox = document.getElementById('moodBox');
            moodBox.textContent = `Mood: ${mood.label} ${mood.emoji} — Score: ${mood.score}/100`;
            
            // Apply mood-based theme
            applyMoodTheme(mood.score);
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

function fetchLocalInfo() {
    const extrasBox = document.getElementById('extrasBox');
    const greetingBox = document.getElementById('greetingBox');
    
    extrasBox.textContent = 'Loading location information...';
    greetingBox.textContent = ''; // Clear greeting box
    
    fetch('https://ipapi.co/json/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Location data not available');
            }
            return response.json();
        })
        .then(data => {
            // Extract the required information
            const country = data.country_name || 'Unknown';
            const currency = data.currency || 'Unknown';
            const languages = data.languages || 'Unknown';
            
            // Extract first language code (e.g. "en-US,fr-CA" → "en")
            const languageCode = languages.split(',')[0].split('-')[0].toLowerCase();
            
            // Get greeting based on language code
            const greeting = greetings[languageCode] || "Hello, world!";
            
            // Display greeting
            greetingBox.innerHTML = `<span>✨ ${greeting}! ✨</span>`;
            
            // Get country flag emoji
            const countryCode = data.country_code || '';
            const flagEmoji = countryCode 
                ? countryCode.toUpperCase().replace(/./g, char => 
                    String.fromCodePoint(char.charCodeAt(0) + 127397))
                : '';
            
            // Get fun fact for the country
            const funFact = countryFacts[country] || "This place is still full of surprises.";
            
            // Format and display information
            extrasBox.innerHTML = `
                <p><em>Based on your network IP:</em></p>
                <p>Country: ${country} ${flagEmoji}<br>
                Currency: ${currency}<br>
                Language: ${languages}</p>
                <p class="country-fact"><em>Did you know?</em> ${funFact}</p>
            `;
        })
        .catch(error => {
            extrasBox.textContent = 'Could not load location info.';
            greetingBox.textContent = '✨ Hello, world! ✨'; // Default greeting on error
            console.error('Location fetch error:', error);
        });
}

// Call functions on page load
// updateTime(); // Now handled in getWeather with location-specific time
getWeather(); // Default to New York on initial load
setupLocationDetection();
fetchLocalInfo(); // Get and display local information 