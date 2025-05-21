// Mood Widget - Lightweight version of main.js
console.log("Mood widget loaded");

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

// Function to apply mood theme based on score
function applyMoodTheme(score) {
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
    
    document.body.style.setProperty('--color1', color1);
    document.body.style.setProperty('--color2', color2);
    document.body.style.setProperty('--text-color', textColor);
}

// Get time of day (simplified)
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

// Calculate mood based on weather and time
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

// Get user's language
function detectLanguage() {
    return fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            // Extract first language code (e.g. "en-US,fr-CA" → "en")
            const languages = data.languages || "en";
            return languages.split(',')[0].split('-')[0].toLowerCase();
        })
        .catch(() => "en"); // Default to English on error
}

// Get weather for default location or user location
function getWeather(params = {}) {
    const apiKey = "my_api_key"; // Replace with your API key
    let apiUrl;
    
    // Show loading state
    const widgetWeather = document.getElementById('widget-weather');
    const widgetMood = document.getElementById('widget-mood');
    const widgetLocation = document.getElementById('widget-location');
    
    // Determine which API endpoint to use
    if (params.lat !== undefined && params.lon !== undefined) {
        // Use coordinates-based API
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}&units=metric`;
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
            
            // Create and display weather info
            widgetWeather.innerHTML = `
                <img src="${iconUrl}" alt="${condition}" />
                <span>${temperature}°C - ${condition}</span>
            `;
            
            // Calculate and display mood
            const timeOfDay = getTimeOfDay();
            const mood = calculateMood(condition, timeOfDay);
            widgetMood.textContent = `${mood.label} ${mood.emoji}`;
            
            // Display location
            widgetLocation.textContent = cityName;
            
            // Apply mood-based theme
            applyMoodTheme(mood.score);
            
            // Remove loading animation
            document.querySelectorAll('#widget-container > div').forEach(el => {
                el.classList.remove('loading');
            });
        })
        .catch(error => {
            widgetWeather.textContent = `Error: ${error.message}`;
            console.error('Weather fetch error:', error);
        });
}

// Initialize widget
async function initWidget() {
    try {
        // Try to get user's language and display greeting
        const widgetGreeting = document.getElementById('widget-greeting');
        const langCode = await detectLanguage();
        const greeting = greetings[langCode] || "Hello";
        widgetGreeting.textContent = `✨ ${greeting}! ✨`;
        
        // Get location and weather
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getWeather({ lat, lon });
                },
                // Error callback - fallback to default city
                () => getWeather()
            );
        } else {
            // Fallback for browsers without geolocation
            getWeather();
        }
    } catch (error) {
        console.error('Widget initialization error:', error);
    }
}

// Start the widget
initWidget(); 