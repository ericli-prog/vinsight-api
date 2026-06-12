const express = require('express');
const { vinsightGet } = require('../vinsight');
const router = express.Router();

// GET /api/inventory - stock items with current on-hand quantities
router.get('/', async (req, res, next) => {
  try {
    const { top = 50, skip = 0, search } = req.query;
    const params = { $top: top, $skip: skip };
    if (search) params.$filter = `contains(Name, '${search}')`;
    const data = await vinsightGet('StockItems', params);
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/inventory/:id - single stock item with location breakdown
router.get('/:id', async (req, res, next) => {
  try {
    const [item, locations] = await Promise.all([
      vinsightGet(`StockItems/${req.params.id}`),
      vinsightGet('StockItemLocations', { $filter: `StockItemNum eq ${req.params.id}` }),
    ]);
    res.json({ ...item, locations: locations.value });
  } catch (err) { next(err); }
});

// GET /api/inventory/stock-as-at?date=YYYY-MM-DD - historical snapshot
router.get('/stock-as-at', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
    const data = await vinsightGet('StockAsAt', { $filter: `AsAtDate eq datetime'${date}'` });
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
