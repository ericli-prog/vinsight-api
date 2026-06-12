const express = require('express');
const { vinsightGet } = require('../vinsight');
const router = express.Router();

// GET /api/bulk/wines - all wine records
router.get('/wines', async (req, res, next) => {
  try {
    const { top = 50, skip = 0 } = req.query;
    const data = await vinsightGet('Wines', { $top: top, $skip: skip });
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/bulk/components - bulk wine components (parcels/batches in tank)
router.get('/components', async (req, res, next) => {
  try {
    const { top = 50, skip = 0 } = req.query;
    const data = await vinsightGet('Components', { $top: top, $skip: skip });
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/bulk/vessels - tanks and vessels with current contents
router.get('/vessels', async (req, res, next) => {
  try {
    const { top = 50, skip = 0 } = req.query;
    const data = await vinsightGet('Vessels', { $top: top, $skip: skip });
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/bulk/batches - wine batches
router.get('/batches', async (req, res, next) => {
  try {
    const { top = 50, skip = 0 } = req.query;
    const data = await vinsightGet('WineBatches', { $top: top, $skip: skip });
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/bulk/operations - winery operations log
router.get('/operations', async (req, res, next) => {
  try {
    const { top = 50, skip = 0 } = req.query;
    const data = await vinsightGet('BulkOperations', { $top: top, $skip: skip });
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
