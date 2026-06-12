const fetch = require('node-fetch');

const BASE_URL = process.env.VINSIGHT_BASE_URL || 'https://app.vinsight.net';
const API_KEY = process.env.VINSIGHT_API_KEY;

async function vinsightGet(resource, params = {}) {
  const query = new URLSearchParams({ 'api-key': API_KEY, ...params });
  const url = `${BASE_URL}/${resource}.json?${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Vinsight error ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = { vinsightGet };
