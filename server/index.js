const express = require('express');
const app = express();
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
