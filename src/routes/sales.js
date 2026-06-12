const express = require('express');
const { vinsightGet } = require('../vinsight');
const router = express.Router();

// GET /api/sales - list sales orders
router.get('/', async (req, res, next) => {
  try {
    const { from, to, top = 50, skip = 0 } = req.query;
    const params = { $top: top, $skip: skip, $orderby: 'OrderDate desc' };
    if (from || to) {
      const filters = [];
      if (from) filters.push(`OrderDate ge datetime'${from}'`);
      if (to)   filters.push(`OrderDate le datetime'${to}'`);
      params.$filter = filters.join(' and ');
    }
    const data = await vinsightGet('SalesOrders', params);
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/sales/:id - single sales order with line items
router.get('/:id', async (req, res, next) => {
  try {
    const [order, items] = await Promise.all([
      vinsightGet(`SalesOrders/${req.params.id}`),
      vinsightGet('SalesOrderItems', { $filter: `SalesOrderNum eq ${req.params.id}` }),
    ]);
    res.json({ ...order, items: items.value });
  } catch (err) { next(err); }
});

module.exports = router;
