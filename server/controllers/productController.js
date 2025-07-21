// server/controllers/productController.js

const axios = require('axios');
const cheerio = require('cheerio');

const getProductDetailsFromAmazon = async (asin) => {
  const url = `https://www.amazon.in/dp/${asin}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(response.data);

    // ✅ Title
    const title = $('#productTitle').text().trim();

    // ✅ Price (new structure based on your HTML)
    let price = $('span.a-price.aok-align-center span.a-price-whole').first().text().trim();
    let currencySymbol = $('span.a-price.aok-align-center span.a-price-symbol').first().text().trim();
    price = price && currencySymbol ? `${currencySymbol}${price}` : 'Price not found';

    // ✅ Rating
    const rating = $('span[data-asin-rating]').first().text().trim() || $('span.a-icon-alt').first().text().trim();

    // ✅ Availability
    const availability = $('#availability span').text().trim();

    // ✅ Description
    const description = $('#productDescription').text().trim() || $('#featurebullets_feature_div').text().trim();

    // ✅ Features (Bullet Points)
    const features = [];
    $('#feature-bullets ul li').each((i, el) => {
      const featureText = $(el).text().trim();
      if (featureText) features.push(featureText);
    });

    // ✅ All Images (hi-res from inline script)
    const images = [];
    const imageScript = response.data.match(/"hiRes":"(.*?)"/g);
    if (imageScript) {
      imageScript.forEach((img) => {
        const cleaned = img.replace(/"hiRes":"|"/g, '');
        if (cleaned && !images.includes(cleaned)) {
          images.push(cleaned);
        }
      });
    }

    // ✅ Main image (fallback)
    const mainImage = images.length > 0 ? images[0] : '';

    return {
      title,
      price,
      rating,
      availability,
      description,
      features,
      image: mainImage,
      images,
    };
  } catch (err) {
    console.error('Scraping failed:', err.message);
    throw new Error('Failed to fetch product details from Amazon');
  }
};

// ✅ POST /api/products/add - Add product by ASIN
exports.addProduct = async (req, res) => {
  const { asin } = req.body;

  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required' });
  }

  try {
    const productData = await getProductDetailsFromAmazon(asin);
    res.json(productData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
