# Feeling Forecast 🌍  
**A one-page emotional map of the world**  
Live mood, weather, time, and ambient sound of any city on Earth.

[🌐 View Live Demo](https://yourusername.github.io/mood)

## Features
- Real-time weather snapshot
- Mood score engine (based on weather + time)
- Animated background that reacts to mood
- Ambient soundscape (based on condition)
- Local time, currency, language, and cultural fact
- Responsive design
- Embeddable widget for websites and blogs
- Installable as a Progressive Web App (PWA)
- Available as a browser extension for Chrome/Firefox

## Progressive Web App
This project can be installed as a standalone app on mobile and desktop:
- Works offline with cached assets
- Home screen icon
- Fullscreen mode without browser UI
- Fast loading from cache

To install:
- **Mobile**: Tap "Add to Home Screen" in your browser menu
- **Desktop Chrome**: Click the install icon in the address bar
- **Desktop Edge**: Click the install icon in the address bar

## Browser Extension
The project is also available as a browser extension for quick mood/weather checks:
- Install in Chrome or Firefox
- Compact popup interface
- Access from any webpage
- Uses your current location

To install (developer mode):
1. Go to `chrome://extensions` or `about:debugging` in Firefox
2. Enable "Developer Mode"
3. Click "Load unpacked" or "Load Temporary Add-on"
4. Select the `/extension` folder

## Widget Embed
Add the mood widget to your website:

```html
<iframe src="https://yourusername.github.io/mood/iframe.html" width="300" height="200" frameborder="0"></iframe>
```

The widget displays:
- Language-based greeting
- Weather conditions with icon
- Current mood with emoji
- Location name

## Tech
- HTML, CSS, JavaScript
- OpenWeatherMap API
- IPAPI, Service Workers, GitHub Pages

## Deployment
1. Clone this repository
2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Replace `my_api_key` with your actual API key in main.js and widget.js
4. Commit and push to GitHub
5. Enable GitHub Pages in your repository settings (branch: main, folder: /root)

## License
MIT