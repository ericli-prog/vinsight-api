require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/sales',     require('./routes/sales'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/bulk',      require('./routes/bulk'));

app.get('/', (req, res) => {
  res.json({
    name: 'Vinsight API',
    version: '1.0.0',
    routes: [
      'GET /api/sales',
      'GET /api/sales/:id',
      'GET /api/inventory',
      'GET /api/inventory/:id',
      'GET /api/inventory/stock-as-at?date=YYYY-MM-DD',
      'GET /api/bulk/wines',
      'GET /api/bulk/components',
      'GET /api/bulk/vessels',
      'GET /api/bulk/batches',
      'GET /api/bulk/operations',
    ],
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Vinsight API running on http://localhost:${PORT}`));
