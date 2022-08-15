import usePair from 'hooks/usePair';
import { useBinance } from 'contexts/BinanceContext';
import { useBitfinex } from 'contexts/BitfinexContext';
import { useKraken } from 'contexts/KrakenContext';
import { useMemo } from 'react';
import { useHuobi } from '../contexts/HuobiContext';

/*
 * Connect all socket contexts and prepare data for UI
 */

const useProviderData = (sortByPrice) => {
  const { normalizedPair } = usePair(); // Get normalized path for UI
  const { price: binancePriceValue } = useBinance(); // Fetch prices data from Binance via websocket
  const { price: bitfinexPriceValue } = useBitfinex(); // Fetch prices data from Bitfinex via websocket
  const { price: krakenPriceValue } = useKraken(); // Fetch prices data from Kraken via websocket
  const { price: huobiPriceValue } = useHuobi(); // Fetch prices date on time period from local server -> Fallback cause socket is not connecting

  // Remap and sort data from all Providers
  const data = useMemo(() => {
    return [
      {
        provider: 'Binance',
        price: binancePriceValue,
        pair: normalizedPair,
      },
      {
        provider: 'Bitfinex',
        price: bitfinexPriceValue,
        pair: normalizedPair,
      },
      {
        provider: 'Kraken',
        price: krakenPriceValue,
        pair: normalizedPair,
      },
      {
        provider: 'Huobi',
        price: huobiPriceValue,
        pair: normalizedPair,
      },
    ].sort((a, b) => {
      if (sortByPrice) {
        return Number(a.price) - Number(b.price);
      } else return 0;
    });
  }, [
    binancePriceValue,
    normalizedPair,
    bitfinexPriceValue,
    krakenPriceValue,
    huobiPriceValue,
    sortByPrice,
  ]);
  // Export array of prices for each provider
  return { data };
};

export default useProviderData;
