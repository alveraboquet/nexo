const axios = require('axios');
const moment = require('moment/moment');

// Format for date time in trades responses
const FORMAT = 'HH:mm:ss';

// Resolver responsible for handling requests to multiple API providers
const resolver = {
  // Fetch trades data from Binance API and parse it.
  bitfinex: async (pair) => {
    try {
      const result = await axios.get(
        `https://api-pub.bitfinex.com/v2/trades/t${pair}/hist?limit=5`
      );
      if (result.data.length === 0) {
        return [{ status: 'Pair not available', provider: 'bitfinex', type: 'error' }];
      }
      return resolver.parser.bitfinex(result.data); // TODO:: RETURN EMPTY ARRAY
    } catch (err) {
      return [{ status: 'Pair not available', provider: 'bitfinex', type: 'error' }];
    }
  },

  // Fetch trades data from Kraken API and parse it
  kraken: async (pair) => {
    try {
      const result = await axios.get(`https://api.kraken.com/0/public/Trades?pair=${pair}`);
      if (result.data.error.length > 0) {
        return [{ status: 'Pair not available', provider: 'kraken', type: 'error' }];
      }
      const dataArr = Object.values(result.data.result)[0]
        .sort((a, b) => b[2] - a[2])
        .slice(0, 5);
      return resolver.parser.kraken(dataArr);
    } catch (err) {
      return [{ status: 'Pair not available', provider: 'kraken', type: 'error' }];
    }
  },

  // Fetch trades data from Binance API and parse it
  binance: async (pair) => {
    try {
      const result = await axios.get(
        `https://api.binance.com/api/v3/trades?symbol=${pair}&limit=5`
      );
      return resolver.parser.binance(result.data);
    } catch (err) {
      return [{ status: 'Pair not available', provider: 'binance', type: 'error' }];
    }
  },

  // Fetch trades data from Huobi API and parse it
  huobi: async (pair) => {
    try {
      const result = await axios.get(
        `https://api.huobi.pro/market/history/trade?symbol=${pair.toLowerCase()}&size=5`
      );
      if (result.data.status === 'error')
        return [{ status: 'Pair not available', provider: 'huobi', type: 'error' }];
      return resolver.parser.huobi(result.data.data);
    } catch (err) {
      return [{ status: 'Pair not available', provider: 'huobi', type: 'error' }];
    }
  },

  // Fixing url for pairs for different Providers
  pairFixer: {
    // Regular parse of pairs
    normal: (pair) => {
      return pair.join('');
    },
    // Handle spacial USD type in Binance API
    binance: (pair) => {
      return pair
        .map((item) => {
          if (item === 'USD') return 'BUSD';
          return item;
        })
        .join('');
    },
    // Handle spacial USD type in Huobi API
    huobi: (pair) => {
      return pair
        .map((item) => {
          if (item === 'USD') return 'USDC';
          return item;
        })
        .join('')
        .toLowerCase();
    },
  },

  // Data parser to ensure data equality on front-end
  parser: {
    bitfinex: (data) => {
      return data.map((detailsArr) => {
        return {
          time: moment(detailsArr[1]).format(FORMAT),
          type: detailsArr[2] < 0 ? 'Sell' : 'Buy',
          quality: Math.abs(detailsArr[2]),
          atPrice: detailsArr[3],
          provider: 'bitfinex',
        };
      });
    },
    kraken: (data) => {
      return data.map((detailsArr) => {
        return {
          time: moment(detailsArr[2] * 1000).format(FORMAT),
          type: detailsArr[3] === 's' ? 'Sell' : 'Buy',
          quality: detailsArr[1],
          atPrice: detailsArr[0],
          provider: 'kraken',
        };
      });
    },
    binance: (data) => {
      return data.map((trade) => {
        return {
          time: moment(trade.time).format(FORMAT),
          type: trade.isBuyerMaker ? 'Sell' : 'Buy',
          quality: trade.qty,
          atPrice: trade.price,
          provider: 'binance',
        };
      });
    },
    huobi: (data) => {
      return data.map((trade) => {
        const details = trade.data[0];
        return {
          time: moment(details.ts).format(FORMAT),
          type: details.direction === 'sell' ? 'Sell' : 'Buy',
          quality: details.amount,
          atPrice: details.price,
          provider: 'huobi',
        };
      });
    },
  },

  // Call all providers to fetch trades data
  caller: async (pair) => {
    const query = resolver.pairFixer.normal(pair);
    const binanceQuery = resolver.pairFixer.binance(pair);
    const huobiQuery = resolver.pairFixer.huobi(pair);
    return await Promise.all([
      resolver.binance(binanceQuery),
      resolver.bitfinex(query),
      resolver.kraken(query),
      resolver.huobi(huobiQuery),
    ]).catch((err) => {
      console.log('ERROR::', err);
    });
  },

  // Caller for price details for Huobi -> Fallback cause socket does not work for this provider
  price: {
    huobi: async (pair) => {
      try {
        const huobiQuery = resolver.pairFixer.huobi(pair);
        const result = await axios.get(
          `https://api.huobi.pro/market/detail/merged?symbol=${huobiQuery}`
        );
        return { price: result.data.tick.close, provider: 'huobi', pair: pair.join('/') };
      } catch (err) {
        return { price: 'Not available', provider: 'huobi', pair: pair.join('/') };
      }
    },
  },
};

module.exports = resolver;
