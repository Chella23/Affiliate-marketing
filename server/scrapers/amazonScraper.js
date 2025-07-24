const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAmazonProduct = async (asin) => {
  const url = `https://www.amazon.in/dp/${asin}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(data);

    const title = $('#productTitle').text().trim();

    let price = $('span.a-price.aok-align-center span.a-price-whole').first().text().trim();
    let currencySymbol = $('span.a-price.aok-align-center span.a-price-symbol').first().text().trim();
    price = price && currencySymbol ? `${currencySymbol}${price}` : 'Price not found';

    const rating = $('span[data-asin-rating]').first().text().trim() || $('span.a-icon-alt').first().text().trim();
    const availability = $('#availability span').text().trim();
    const description = $('#productDescription').text().trim() || $('#featurebullets_feature_div').text().trim();

    const features = [];
    $('#feature-bullets ul li').each((i, el) => {
      const featureText = $(el).text().trim();
      if (featureText) features.push(featureText);
    });

    const images = [];
    const imageScript = data.match(/"hiRes":"(.*?)"/g);
    if (imageScript) {
      imageScript.forEach((img) => {
        const cleaned = img.replace(/"hiRes":"|"/g, '');
        if (cleaned && !images.includes(cleaned)) {
          images.push(cleaned);
        }
      });
    }

    const mainImage = images.length > 0 ? images[0] : '';

    return {
      asin,
      title,
      price,
      rating,
      availability,
      description,
      features,
      image: mainImage,
      images,
    };
  } catch (error) {
    console.error('Scraping failed:', error.message);
    throw new Error('Failed to scrape product data from Amazon');
  }
};

module.exports = scrapeAmazonProduct;
