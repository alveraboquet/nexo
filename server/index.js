/*
 * Express server to handle CORS Blocking request from browser
 * Fetching trades list for all APIs
 * Fetching price data from Huobi as it's websocket does not work / fail to connect in front-end
 */
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const port = 3214;
const resolver = require('./resolver');
const _ = require('lodash');

// Handle local cors not allowed
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

// End point for fetching trades data for all providers
app.get('/trades/:first/:second', async (req, res) => {
  const results = await resolver.caller([req.params.first, req.params.second]);
  const flatArr = _.flatten(results);
  const grouped = _.groupBy(flatArr, (item) => item.provider);
  res.json(grouped);
});

// Endpoint for fetching prices from Huobi API
app.get('/price/:first/:second', async (req, res) => {
  const result = await resolver.price.huobi([req.params.first, req.params.second]);
  res.json(result);
});

// Handle all other requests
app.get('*', (req, res) => {
  return res.status(501).json({ status: 'Not Implemented' });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
