const fetch = global.fetch || require('node-fetch');

exports.handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body);
    const apiKey = process.env.PIXABAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'PIXABAY_API_KEY not set in environment variables.' }),
      };
    }

    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=1`;
    const resp = await fetch(url);
    const data = await resp.json();
    const img = data.hits?.[0];
    if (!img) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No image found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: img.largeImageURL,
        photographer: img.user,
        photographer_url: `https://pixabay.com/users/${img.user}-${img.user_id}/`,
        source_url: img.pageURL,
        api: 'pixabay',
        id: `pixabay_${img.id}`,
      }),
    };
  } catch (error) {
    console.error('Error fetching from Pixabay API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image from Pixabay.' }),
    };
  }
};
