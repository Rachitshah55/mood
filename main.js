console.log('main.js loaded');
console.log("Stage 1 layout loaded");

// Store the interval ID for the time update to clear it later
let timeUpdateIntervalId;

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

// Background image mapping
const backgroundMap = {
    "Clear-morning": "sunny-beach",
    "Clear-night": "cyberpunk",
    "Rain-evening": "rainy-night",
    "Rain-morning": "rainy-cafe",
    "Clouds-afternoon": "cozy-cafe",
    "Snow-afternoon": "city-snow",
    "Storm-night": "cyberpunk-cafe",
    "Hot-afternoon": "palm-beach",
    "Wind-day": "beach-day"
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
    attemptAudioPlayback(audio, 'click');
}, { once: true });

// Function to attempt audio playback
function attemptAudioPlayback(audioElement, sourceEvent) {
    if (audioElement && audioElement.paused) {
        try {
            audioElement.play()
                .then(() => {
                    console.log(`Audio playback started after ${sourceEvent}`);
                    document.getElementById('soundBox').innerHTML = '';
                })
                .catch(e => {
                    console.warn(`Audio autoplay blocked (${sourceEvent}):`, e);
                });
        } catch (e) {
            console.warn(`Audio autoplay blocked (${sourceEvent}):`, e);
        }
    }
}

// Enable ambient sound after first user interaction (touch - for mobile)
document.addEventListener('touchstart', () => {
    const audio = document.getElementById('ambientAudio');
    attemptAudioPlayback(audio, 'touch');
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

// Remove the old updateTime function as time will be updated by getWeather


// Modified function to format local time using a timezone offset
function formatLocalTime(timezoneOffsetInSeconds) {
    // Get the current UTC time in milliseconds
    const nowUtc = Date.now();
    // Add the timezone offset (in milliseconds) to the UTC time
    const localTimestamp = nowUtc + timezoneOffsetInSeconds * 1000;
    const local = new Date(localTimestamp);
    
    const hours = local.getUTCHours().toString().padStart(2, '0');
    const minutes = local.getUTCMinutes().toString().padStart(2, '0');
    const seconds = local.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

// Modified function to get the hour of the day using a timezone offset
function getTimeOfDay(timezoneOffsetInSeconds) {
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
        'Clear': 'birds.mp3',
        'Rain': 'rain.mp3',
        'Drizzle': 'rain.mp3',
        'Thunderstorm': 'storm.mp3',
        'Snow': 'wind.mp3',
        'Mist': 'wind.mp3',
        'Haze': 'wind.mp3',
        'Fog': 'wind.mp3',
        'Clouds': 'wind.mp3'
    };
    
    // Default to birds.mp3 if the weather condition is not mapped
    const filename = soundMap[weatherCondition] || 'birds.mp3';
    
    console.log('Weather condition:', weatherCondition);
    console.log('Selected audio file:', filename);
    
    // Set audio source
    audioEl.pause();  // stop anything previous
    audioEl.removeAttribute('src'); // clear
    audioEl.load();  // reset

    audioEl.src = `./assets/sounds/${filename}`;
    audioEl.loop = true;
    
    console.log("Trying to load and play:", audioEl.src);
    
    // Try to play the audio (may fail due to autoplay restrictions)
    try {
        const playPromise = audioEl.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio playback started successfully');
            }).catch(error => {
                console.error('Audio playback failed:', error);
                soundBox.innerHTML = '<p>Tap anywhere to enable ambient sound</p>';
            });
        }
    } catch (error) {
        console.error('Audio playback error:', error);
        soundBox.innerHTML = '<p>Tap anywhere to enable ambient sound</p>';
    }
}

function buildVisualPrompt(data) {
    // Extract data
    const { weatherCondition, cityName, localTime, moodScore, moodLabel } = data;
    
    // Map weather conditions to visual effects
    const weatherEffects = {
        'Clear': 'clear skies with golden light',
        'Clouds': 'soft diffused light through clouds',
        'Rain': 'rain drops with reflections',
        'Drizzle': 'light drizzle creating a misty atmosphere',
        'Snow': 'gentle snowfall with crystalline reflections',
        'Thunderstorm': 'dramatic lightning illuminating dark clouds',
        'Mist': 'ethereal mist creating a dreamy atmosphere',
        'Fog': 'thick fog with limited visibility',
        'Haze': 'hazy atmosphere with diffused light'
    };
    
    // Map mood scores to artistic styles and tones
    let style, moodTone;
    
    if (moodScore >= 80) {
        style = ['Vibrant impressionism', 'Colorful pop art', 'Bright watercolor', 'Cheerful digital art'][Math.floor(Math.random() * 4)];
        moodTone = 'uplifting and energetic';
    } else if (moodScore >= 60) {
        style = ['Soft pastel art', 'Relaxed impressionism', 'Warm digital painting', 'Light and airy photography'][Math.floor(Math.random() * 4)];
        moodTone = 'peaceful and content';
    } else if (moodScore >= 40) {
        style = ['Balanced photography', 'Realistic digital art', 'Modern minimalism', 'Clean line art'][Math.floor(Math.random() * 4)];
        moodTone = 'neutral and balanced';
    } else if (moodScore >= 20) {
        style = ['Muted photography', 'Melancholic digital art', 'Somber impressionism', 'Moody noir style'][Math.floor(Math.random() * 4)];
        moodTone = 'reflective and calm';
    } else {
        style = ['Dark expressionism', 'Dramatic noir', 'Moody low-key photography', 'Gritty realism'][Math.floor(Math.random() * 4)];
        moodTone = 'introspective and subdued';
    }
    
    // Determine base scene based on city name
    // This is a simplified approach - could be expanded with more city-specific scenes
    const urbanScenes = ['city skyline', 'busy street', 'urban park', 'cafe terrace', 'public square'];
    const naturalScenes = ['coastline', 'mountain view', 'forest clearing', 'riverside', 'meadow'];
    const scenes = [...urbanScenes, ...naturalScenes];
    
    // Use hash of city name to consistently select the same scene for the same city
    const cityHash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseScene = `${cityName} ${scenes[cityHash % scenes.length]}`;
    
    // Determine time of day
    const hour = parseInt(localTime.split(':')[0], 10);
    let timeOfDay;
    
    if (hour >= 5 && hour < 8) {
        timeOfDay = 'dawn';
    } else if (hour >= 8 && hour < 12) {
        timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 16) {
        timeOfDay = 'afternoon';
    } else if (hour >= 16 && hour < 19) {
        timeOfDay = 'golden hour';
    } else if (hour >= 19 && hour < 22) {
        timeOfDay = 'dusk';
    } else {
        timeOfDay = 'night';
    }
    
    // Get weather effect
    const weatherEffect = weatherEffects[weatherCondition] || 'ambient atmospheric conditions';
    
    // Build full prompt
    const fullPrompt = `${style} of ${baseScene} at ${timeOfDay}, ${weatherEffect}, ${moodTone} atmosphere, ${moodLabel} mood`;
    
    return {
        style,
        baseScene,
        timeOfDay,
        weatherEffect,
        moodTone,
        fullPrompt
    };
}



function getWeather(params = {}) {
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


        playAmbientSound(condition);

        // Calculate and display mood using the correct time of day for the location
        const timeOfDay = getTimeOfDay(timezoneOffset); // Pass the timezone offset
        const mood = calculateMood(condition, timeOfDay);
        const moodBox = document.getElementById('moodBox');
        moodBox.textContent = `Mood: ${mood.label} ${mood.emoji} — Score: ${mood.score}/100`;

        applyMoodTheme(mood.score);

        // Generate visual prompt using the correct time of day
        const visualPrompt = buildVisualPrompt({
            weatherCondition: condition,
            cityName: cityName,
            localTime: formatLocalTime(timezoneOffset), // Pass the correctly formatted local time string
            moodScore: mood.score,
            moodLabel: mood.label
        });


        console.log("Generated Visual Prompt:", visualPrompt.fullPrompt);

        const sceneKey = `${condition}-${timeOfDay}`;
        console.log("Scene key:", sceneKey);

        const filename = backgroundMap[sceneKey] || "sunny-beach";
        console.log("Resolved filename:", filename);

        const bgUrl = `./assets/placeholders/${filename}.jpg`;
        console.log("Image path:", bgUrl);

        document.getElementById("bgImageLayer").style.backgroundImage = `url('${bgUrl}')`;
    })
    .catch(error => {
        weatherBox.textContent = `Error: ${error.message}`;
        timeBox.textContent = ''; // Clear time on error
        if (timeUpdateIntervalId) {
            clearInterval(timeUpdateIntervalId);
        }
        console.error('Weather fetch error:', error);
    });
}


function setupLocationDetection() {
    const detectLocationBtn = document.querySelector('.search-section button');
    const cityInput = document.querySelector('.search-section input'); // Declare cityInput here
    
    // Event listener for the "Detect My Location" button
    if (detectLocationBtn) { // Added defensive check for the button
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
    }
    
    // Event listener for city input (when user presses Enter)
    if (cityInput) { // Added defensive check for the input
        cityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && cityInput.value.trim() !== '') {
                getWeather({ city: cityInput.value.trim() });
            }
        });
    } else {
        console.error("cityInput not found! Check your HTML or selector.");
    }
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

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(reg => console.log("Service Worker registered", reg))
    .catch(err => console.error("Service Worker failed", err));
} 