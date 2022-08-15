import { useMatch } from 'react-router-dom';
import { useMemo } from 'react';

/*
 * Hook to handle URL Paths with pairs & pair with details
 */
const usePair = () => {
  const match = useMatch('/:first/:second');
  const matchDetails = useMatch('/:first/:second/details');
  // Combine both paths details where needed
  const routeData = match || matchDetails || null;

  // Normalized pair for URL or display in UI
  const normalizedPair = useMemo(() => {
    if (routeData) return [routeData.params.first, routeData.params.second].join('/');
    return '';
  }, [routeData]);

  // Pair as an array if needed
  const pair = useMemo(() => {
    if (routeData) return [routeData.params.first, routeData.params.second];
    return [];
  }, [routeData]);

  // Matching spacial USD in binance for websocket connection
  const binanceURL = useMemo(() => {
    return pair
      .map((item) => {
        return item === 'USD' ? 'busd' : item.toLowerCase();
      })
      .join('');
  }, [pair]);

  // Normalizing bitfinex path for Websocket: tBTCUSD
  const bitfinexURL = useMemo(() => {
    return `t${pair.join('')}`;
  }, [pair]);

  // Normalize kraken path for Websocket: BTC/USD
  const krakenURL = useMemo(() => {
    return pair.join('/');
  }, [pair]);

  // Boolean to check if modal should be onpen or not, based ot URL path
  const isModalOpen = useMemo(() => {
    return !!matchDetails;
  }, [matchDetails]);

  // Export all needed data
  return { normalizedPair, pair, binanceURL, bitfinexURL, krakenURL, isModalOpen };
};

export default usePair;
