// Country facts map
export const countryFacts = {
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
export const greetings = {
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

// Function to set up location detection via Geolocation or manual input
export function setupLocationDetection(getWeather) {
    const detectLocationBtn = document.querySelector('.search-section button');
    const cityInput = document.querySelector('.search-section input');
    
    // Event listener for the "Detect My Location" button
    if (detectLocationBtn) {
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
    if (cityInput) {
        cityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && cityInput.value.trim() !== '') {
                getWeather({ city: cityInput.value.trim() });
            }
        });
    } else {
        console.error("cityInput not found! Check your HTML or selector.");
    }
}

// Function to fetch and display local information based on IP
export function fetchLocalInfo() {
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