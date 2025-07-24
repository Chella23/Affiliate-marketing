const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const AFFILIATE_TAG = 'chella09-21'; // ✅ Your Amazon Affiliate tag

const getProductDetailsFromAmazon = async (asin) => {
  const productUrl = `https://www.amazon.in/dp/${asin}?tag=${AFFILIATE_TAG}`;

  try {
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();

    let price = $('span.a-price.aok-align-center span.a-price-whole').first().text().trim();
    const currencySymbol = $('span.a-price.aok-align-center span.a-price-symbol').first().text().trim();
    price = price && currencySymbol ? `${currencySymbol}${price}` : 'Price not found';

    const rating = $('span[data-asin-rating]').first().text().trim() || $('span.a-icon-alt').first().text().trim();
    const availability = $('#availability span').text().trim();
    const description = $('#productDescription').text().trim() || $('#featurebullets_feature_div').text().trim();

    const features = [];
    $('#feature-bullets ul li').each((i, el) => {
      const text = $(el).text().trim();
      if (text) features.push(text);
    });

    const images = [];
    const imageMatches = response.data.match(/"hiRes":"(.*?)"/g);
    if (imageMatches) {
      imageMatches.forEach((match) => {
        const imageUrl = match.replace(/"hiRes":"|"/g, '');
        if (imageUrl && !images.includes(imageUrl)) {
          images.push(imageUrl);
        }
      });
    }

    const mainImage = images.length > 0 ? images[0] : '';

    return {
      asin,
      affiliateLink: productUrl,
      title,
      price,
      rating,
      availability,
      description,
      features,
      image: mainImage,
      images
    };
  } catch (err) {
    console.error(`Error scraping ASIN ${asin}:`, err.message);
    return {
      asin,
      error: 'Scraping failed'
    };
  }
};

// ✅ POST /api/products/add - Add product by ASIN (optional if you're using only JSON list)
exports.addProduct = async (req, res) => {
  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required' });
  }

  try {
    const product = await getProductDetailsFromAmazon(asin);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET /api/products/fetch - Fetch all ASINs from JSON and scrape them
exports.fetchAllProducts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/products.json');
    const asinList = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const productData = await Promise.all(asinList.map(getProductDetailsFromAmazon));
    res.json(productData);
  } catch (error) {
    console.error('Failed to load ASINs:', error.message);
    res.status(500).json({ error: 'Failed to load product list' });
  }
};
