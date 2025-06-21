const fetch = global.fetch || require('node-fetch');

exports.handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body);
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'PEXELS_API_KEY not set in environment variables.' }),
      };
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
    const resp = await fetch(url, { headers: { Authorization: apiKey } });
    const data = await resp.json();
    const photo = data.photos?.[0];
    if (!photo) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No image found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: photo.src.landscape,
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        source_url: photo.url,
        api: 'pexels',
        id: `pexels_${photo.id}`,
      }),
    };
  } catch (error) {
    console.error('Error fetching from Pexels API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image from Pexels.' }),
    };
  }
};
