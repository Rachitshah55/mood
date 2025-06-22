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

// Function to attempt audio playback (handles autoplay restrictions)
export function attemptAudioPlayback(audioElement, sourceEvent) {
    if (audioElement && audioElement.paused) {
        try {
            audioElement.play()
                .then(() => {
                    console.log(`Audio playback started after ${sourceEvent}`);
                    // Clear the sound box message on successful playback
                    const soundBox = document.getElementById('soundBox');
                    if (soundBox) soundBox.innerHTML = '';
                })
                .catch(e => {
                    console.warn(`Audio autoplay blocked (${sourceEvent}):`, e);
                     // Display a message prompting user interaction if autoplay blocked
                     const soundBox = document.getElementById('soundBox');
                     if (soundBox) soundBox.innerHTML = '<p>Tap anywhere to enable ambient sound</p>';
                });
        } catch (e) {
            console.warn(`Audio autoplay blocked (${sourceEvent}):`, e);
            // Display a message prompting user interaction if autoplay blocked
             const soundBox = document.getElementById('soundBox');
             if (soundBox) soundBox.innerHTML = '<p>Tap anywhere to enable ambient sound</p>';
        }
    }
}

// Function to play ambient sound based on weather condition
export function playAmbientSound(weatherCondition) {
    const soundBox = document.getElementById('soundBox');
    const audioEl = document.getElementById('ambientAudio');
    
    if (!audioEl) {
        console.error('Ambient audio element not found!');
        return;
    }

    // Default to birds.mp3 if the weather condition is not mapped
    const filename = soundMap[weatherCondition] || 'birds.mp3';
    
    console.log('Weather condition:', weatherCondition);
    console.log('Selected audio file:', filename);
    
    const newSrc = `./assets/sounds/${filename}`;

    // Only change source and attempt play if the sound file is different
    if (audioEl.src.indexOf(newSrc) === -1) {
         console.log("Changing audio source to:", newSrc);
         audioEl.pause();  // Stop current playback
         audioEl.src = newSrc;
         audioEl.loop = true;
         audioEl.load();  // Load the new audio
         attemptAudioPlayback(audioEl, 'weather change'); // Attempt playback after changing source
    } else {
        console.log("Audio source is already:", newSrc);
         // If already playing the correct sound, just ensure it's playing (handles cases where it might have been paused manually or by the browser)
         attemptAudioPlayback(audioEl, 'weather check');
    }
}

// Event listener for initial user interaction (click) to enable audio
document.addEventListener('click', () => {
    const audio = document.getElementById('ambientAudio');
     // Only attempt playback if the audio element exists and is paused
    if (audio && audio.paused) {
         attemptAudioPlayback(audio, 'initial click');
     }
}, { once: true }); // Use { once: true } to remove the listener after the first click

// Event listener for initial user interaction (touch - for mobile) to enable audio
document.addEventListener('touchstart', () => {
    const audio = document.getElementById('ambientAudio');
     // Only attempt playback if the audio element exists and is paused
     if (audio && audio.paused) {
         attemptAudioPlayback(audio, 'initial touch');
     }
}, { once: true }); // Use { once: true } so this only triggers on the *first* touchstart

