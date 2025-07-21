// scrapers/amazonScraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAmazonProduct = async (asin) => {
  const url = `https://www.amazon.in/dp/${asin}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(data);

    const title = $('#productTitle').text().trim();
    const price = $('#priceblock_ourprice, #priceblock_dealprice, #priceblock_saleprice').first().text().trim();
    const rating = $('span.a-icon-alt').first().text().trim();
    const availability = $('#availability span').text().trim();
    const image = $('#landingImage').attr('src');
    const offer = $('#dealprice_savings .a-color-price').text().trim() || $('span.savingsPercentage').first().text().trim();

    return { title, price, rating, availability, image, offer, asin };
  } catch (error) {
    console.error('Scraping failed:', error.message);
    throw new Error('Failed to scrape product data from Amazon');
  }
};

module.exports = scrapeAmazonProduct;
