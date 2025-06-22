// src/app.js

import { getWeather, formatLocalTime, getTimeOfDay } from './weather.js';
import { buildVisualPrompt, fetchBackgroundImage, displayAttribution } from './background.js';
import { playAmbientSound } from './sound.js';
import { calculateMood, applyMoodTheme } from './mood.js';
import { setupLocationDetection, fetchLocalInfo } from './location.js';
import { setupUI } from './ui.js';

// Main function to initialize the app
async function initializeApp(params = {}) {
    try {
        // Fetch weather data
        const weatherData = await getWeather(params);
		if (!weatherData || !weatherData.condition || !weatherData.cityName || !weatherData.timezoneOffset) {
			throw new Error("Weather data unavailable or incomplete.");
		}
		const { condition, cityName, timezoneOffset } = weatherData;


        // Get time of day for mood and background
        const localTime = formatLocalTime(timezoneOffset);
        const timeOfDay = getTimeOfDay(timezoneOffset);

        // Calculate and apply mood
        const mood = calculateMood(condition, timeOfDay);
        const moodBox = document.getElementById('moodBox');
        if (moodBox) {
             moodBox.textContent = `Mood: ${mood.label} ${mood.emoji} — Score: ${mood.score}/100`;
        }
        applyMoodTheme(mood.score);

        // Play ambient sound
        playAmbientSound(condition);

        // Generate visual prompt and fetch background image
        const visualPrompt = buildVisualPrompt({
            weatherCondition: condition,
            cityName: cityName,
            localTime: localTime, // Pass the correctly formatted local time string
            moodScore: mood.score,
            moodLabel: mood.label
        });
        console.log("Generated Visual Prompt:", visualPrompt.fullPrompt);

        // Fetch background image. displayAttribution is called within fetchBackgroundImage
        fetchBackgroundImage(visualPrompt.fullPrompt);

        // Fetch and display local info (greeting, country fact, etc.)
        fetchLocalInfo();

    } catch (error) {
        console.error('Error initializing app:', error);
        const weatherBox = document.getElementById('weatherBox');
         if (weatherBox) {
             weatherBox.textContent = `Error: ${error.message}`;
         }
        const timeBox = document.getElementById('timeBox');
         if (timeBox) {
             timeBox.textContent = ''; // Clear time on error
             // Assuming timeUpdateIntervalId is managed in weather.js or passed/cleared appropriately
         }
        const moodBox = document.getElementById('moodBox');
        if (moodBox) {
            moodBox.textContent = '';
        }
        const attributionDiv = document.getElementById('imageAttribution');
        if (attributionDiv) {
             attributionDiv.innerHTML = 'Could not load data.';
        }

    }
}

// Initial calls on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js loaded');
    console.log("Stage 1 layout loaded");

    // Setup UI listeners (including idle timer)
    setupUI();

    // Setup location detection listeners (will call initializeApp on user input/detection)
    setupLocationDetection(initializeApp);

    // Initial weather fetch (defaulting to New York or similar if no params provided)
    // This call will trigger the full app initialization process
    initializeApp();

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("../service-worker.js") // Note the path adjustment
        .then(reg => console.log("Service Worker registered", reg))
        .catch(err => console.error("Service Worker failed", err));
    }
});
