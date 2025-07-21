const cron = require('node-cron');
const fs = require('fs');
const { scrapeAmazonProduct } = require('../scrapers/amazonScraper');

const urls = [/* same URLs */];

cron.schedule('0 */3 * * *', async () => {
  console.log('🔁 Cron: Updating product data...');
  const results = await Promise.all(urls.map((url) => scrapeAmazonProduct(url)));
  fs.writeFileSync('products.json', JSON.stringify(results, null, 2));
});
