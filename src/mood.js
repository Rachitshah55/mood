export function applyMoodTheme(score) {
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

export function calculateMood(weatherCondition, timeOfDay) {
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