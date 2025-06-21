const fetch = global.fetch || require('node-fetch');

exports.handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body);
    const apiKey = process.env.UNSPLASH_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'UNSPLASH_API_KEY not set in environment variables.' }),
      };
    }

    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${apiKey}`;
    const resp = await fetch(url);
    const photo = await resp.json();
    if (!photo || photo.errors) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No image found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: photo.urls.regular,
        photographer: photo.user.name,
        photographer_url: photo.user.links.html,
        source_url: photo.links.html,
        api: 'unsplash',
        id: `unsplash_${photo.id}`,
      }),
    };
  } catch (error) {
    console.error('Error fetching from Unsplash API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image from Unsplash.' }),
    };
  }
};
