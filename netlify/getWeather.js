const fetch = global.fetch || require('node-fetch');

exports.handler = async (event) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const { lat, lon, city } = JSON.parse(event.body);
    let url;

    if (lat !== undefined && lon !== undefined) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${API_KEY}&units=metric`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Weather function failed", details: err.message }),
    };
  }
};
