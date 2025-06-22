// Background image mapping
export const backgroundMap = {
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

export function buildVisualPrompt(data) {
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

// Function to display image attribution
export function displayAttribution(data) {
    const attributionDiv = document.getElementById('imageAttribution');
    if (!attributionDiv) {
        console.error('Attribution div not found!');
        return;
    }

    let attributionHTML = '';

    if (data && data.url && data.photographer && data.source_url && data.api) {
        // Basic attribution structure - can be refined based on API requirements
        // Example formats based on common requirements:
        // Pexels: "Photo by [Photographer Name] from Pexels" linking Photographer Name to photographer_url or source_url
        // Pixabay: "Image by [Photographer Name] on Pixabay" linking Photographer Name to photographer_url or source_url
        // Unsplash: "Photo by [Photographer Name] on Unsplash" linking Photographer Name to photographer_url or source_url

        let photographerLink = data.photographer;
        if (data.photographer_url) {
             photographerLink = `<a href="${data.photographer_url}" target="_blank" rel="noopener noreferrer">${data.photographer}</a>`;
        } else if (data.source_url) {
             // Fallback to source_url if photographer_url is not provided
             photographerLink = `<a href="${data.source_url}" target="_blank" rel="noopener noreferrer">${data.photographer}</a>`;
        }

        let sourceLink = '';
        if (data.api === 'pexels') {
            sourceLink = ` from <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>`;
        } else if (data.api === 'pixabay') {
            sourceLink = ` on <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer">Pixabay</a>`;
        } else if (data.api === 'unsplash') {
             sourceLink = ` on <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">Unsplash</a>`;
        }

        attributionHTML = `Photo by ${photographerLink}${sourceLink}`;

    } else if (data && data.error) {
        attributionHTML = `Error loading image: ${data.error}`;
    }
     else {
        attributionHTML = 'Image attribution will appear here.';
    }

    attributionDiv.innerHTML = attributionHTML;
}


// Function to fetch background image from APIs via Netlify Functions
export async function fetchBackgroundImage(query) {
    const bgImageLayer = document.getElementById("bgImageLayer");
    const attributionDiv = document.getElementById('imageAttribution');

    // Attempt to load cached image first
    const cachedImageUrl = localStorage.getItem('ff_last_image_url');
    if (cachedImageUrl) {
        bgImageLayer.style.backgroundImage = `url('${cachedImageUrl}')`;
        console.log('Loaded background from cache:', cachedImageUrl);
        // Display a generic attribution or indicate it's cached if needed
        displayAttribution({ error: 'Loading new image...' }); // Clear previous attribution while fetching
    } else {
         displayAttribution({ error: 'Fetching initial background image...' });
    }


    const apiEndpoints = [
        '/.netlify/functions/fetchPexels',
        '/.netlify/functions/fetchPixabay',
        '/.netlify/functions/fetchUnsplash'
    ];

    const apiCount = parseInt(localStorage.getItem('ff_api_count' ) || '0', 10);
    // Determine the order of APIs based on the count for cycling
    const apiOrder = [
        apiEndpoints[apiCount % 3],
        apiEndpoints[(apiCount + 1) % 3],
        apiEndpoints[(apiCount + 2) % 3],
    ];

    const imageCache = JSON.parse(localStorage.getItem('ff_image_cache') || '[]');
    const MAX_CACHE_SIZE = 100;

    for (const endpoint of apiOrder) {
        try {
            console.log(`Attempting to fetch image from ${endpoint} with query: "${query}"`);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ error: response.statusText })); // Try to parse error body
                 console.error(`Error fetching from ${endpoint}:`, errorData.error);
                 displayAttribution({ error: `Failed to fetch from ${endpoint.split('/').pop().replace('fetch', '')}` });
                 continue; // Try the next API
            }

            const data = await response.json();

            if (data.error) {
                console.error(`API error from ${endpoint}:`, data.error);
                displayAttribution({ error: `API error from ${endpoint.split('/').pop().replace('fetch', '')}: ${data.error}` });
                continue; // Try the next API
            }

            // Check for deduplication
            if (data.id && imageCache.includes(data.id)) {
                console.log(`Image ID ${data.id} already in cache, trying next API.`);
                displayAttribution({ error: `Skipping duplicate image from ${data.api}` });
                continue; // Skip to the next API
            }

            // On success: update background, cache, attribution, and API count
            document.getElementById("bgImageLayer").style.backgroundImage = `url('${data.url}')`;
            console.log(`Successfully set background image from ${data.api}: ${data.url}`);

            // Update cache
            imageCache.unshift(data.id); // Add to the beginning
            if (imageCache.length > MAX_CACHE_SIZE) {
                imageCache.pop(); // Remove the oldest if exceeding limit
            }
            localStorage.setItem('ff_image_cache', JSON.stringify(imageCache));

            // Display attribution
            displayAttribution(data);

            // Increment API count for cycling
            localStorage.setItem('ff_api_count', (apiCount + 1).toString());


            // On success: update background, cache, attribution, and API count
            bgImageLayer.style.backgroundImage = `url('${data.url}')`;
            console.log(`Successfully set background image from ${data.api}: ${data.url}`);

            // Update image cache for deduplication
            imageCache.unshift(data.id); // Add to the beginning
            if (imageCache.length > MAX_CACHE_SIZE) {
                imageCache.pop(); // Remove the oldest if exceeding limit
            }
            localStorage.setItem('ff_image_cache', JSON.stringify(imageCache));

            // Cache the successfully loaded image URL
            localStorage.setItem('ff_last_image_url', data.url);

            // Display attribution
            displayAttribution(data);

            // Increment API count for cycling
            localStorage.setItem('ff_api_count', (apiCount + 1).toString());

            return; // Exit the loop on success

        } catch (error) {
            console.error(`Fetch error from ${endpoint}:`, error);
            displayAttribution({ error: `Network error fetching from ${endpoint.split('/').pop().replace('fetch', '')}` });
            // Continue to the next API in case of network error
        }
    }

    // If loop finishes without success
    console.warn('All background image APIs failed to fetch a new image.');
    // If there was no cached image initially, or if the cached image failed to load (though browser usually handles this),
    // display an error. Otherwise, the cached image remains visible.
    if (!cachedImageUrl) {
        displayAttribution({ error: 'Could not load a new background image from any source.' });
         // Optionally set a fallback static image here if no cache and all fetches fail
         // document.getElementById("bgImageLayer").style.backgroundImage = `url('./assets/placeholders/sunny-beach.jpg')`;
    } else {
        // If cached image was loaded but new fetch failed, just update attribution to reflect the fetch issue.
         console.log('Using cached image due to fetch failure.');
         displayAttribution({ error: 'Failed to update background image.' }); // More subtle message if using cache
    }


}