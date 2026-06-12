const readline = require('readline');
const fetch = require('node-fetch');

const BASE = 'http://localhost:3000';

async function callApi(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

const tools = [
  {
    name: 'get_sales',
    description: 'Get sales orders from Vinsight. Supports date filtering and pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Start date YYYY-MM-DD' },
        to:   { type: 'string', description: 'End date YYYY-MM-DD' },
        top:  { type: 'number', description: 'Max records to return (default 50)' },
        skip: { type: 'number', description: 'Records to skip for pagination' },
      },
    },
  },
  {
    name: 'get_sale',
    description: 'Get a single sales order with its line items.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'SalesOrderNum' } },
      required: ['id'],
    },
  },
  {
    name: 'get_inventory',
    description: 'Get stock items and on-hand quantities from Vinsight.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Filter by product name' },
        top:    { type: 'number', description: 'Max records (default 50)' },
        skip:   { type: 'number', description: 'Records to skip' },
      },
    },
  },
  {
    name: 'get_stock_item',
    description: 'Get a single stock item with location breakdown.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'StockItemNum' } },
      required: ['id'],
    },
  },
  {
    name: 'get_bulk_wines',
    description: 'Get bulk wine records from Vinsight.',
    inputSchema: {
      type: 'object',
      properties: {
        top:  { type: 'number' },
        skip: { type: 'number' },
      },
    },
  },
  {
    name: 'get_vessels',
    description: 'Get winery tanks and vessels with current contents.',
    inputSchema: {
      type: 'object',
      properties: { top: { type: 'number' }, skip: { type: 'number' } },
    },
  },
  {
    name: 'get_components',
    description: 'Get bulk wine components (parcels in tank).',
    inputSchema: {
      type: 'object',
      properties: { top: { type: 'number' }, skip: { type: 'number' } },
    },
  },
  {
    name: 'get_wine_batches',
    description: 'Get wine batch records.',
    inputSchema: {
      type: 'object',
      properties: { top: { type: 'number' }, skip: { type: 'number' } },
    },
  },
];

async function handleTool(name, args) {
  const qs = new URLSearchParams(args).toString();
  switch (name) {
    case 'get_sales':      return callApi(`/api/sales?${qs}`);
    case 'get_sale':       return callApi(`/api/sales/${args.id}`);
    case 'get_inventory':  return callApi(`/api/inventory?${qs}`);
    case 'get_stock_item': return callApi(`/api/inventory/${args.id}`);
    case 'get_bulk_wines': return callApi(`/api/bulk/wines?${qs}`);
    case 'get_vessels':    return callApi(`/api/bulk/vessels?${qs}`);
    case 'get_components': return callApi(`/api/bulk/components?${qs}`);
    case 'get_wine_batches': return callApi(`/api/bulk/batches?${qs}`);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', async (line) => {
  try {
    const msg = JSON.parse(line);
    let response;

    if (msg.method === 'initialize') {
      response = { jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'vinsight', version: '1.0.0' } } };
    } else if (msg.method === 'tools/list') {
      response = { jsonrpc: '2.0', id: msg.id, result: { tools } };
    } else if (msg.method === 'tools/call') {
      const result = await handleTool(msg.params.name, msg.params.arguments || {});
      response = { jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } };
    } else {
      response = { jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'Method not found' } };
    }

    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (err) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: err.message } }) + '\n');
  }
});
