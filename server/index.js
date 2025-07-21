const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // very important for POST

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
