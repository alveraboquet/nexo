import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import usePair from '../hooks/usePair';

/*
 * Context responsible for fetching prices data from Kraken Websocket API
 */

const KrakenContext = createContext();
export const useKraken = () => useContext(KrakenContext);

const KrakenProvider = ({ children }) => {
  // Connect websocket to Kraken
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(process.env.REACT_APP_KRAKEN_URL);
  const { krakenURL } = usePair();

  const [price, setPrice] = useState('Connecting...');

  // Handle new incoming message and update price data
  const handleResponse = useCallback((data) => {
    if (!data) return;
    const keys = Object.keys(data);
    if (keys.indexOf('errorMessage') !== -1) {
      setPrice('Not available');
    }
    if (Array.isArray(data)) {
      setPrice(data[1].a[0]);
    }
  }, []);

  // Subscribe and unsubscripe for socket event/message when new pair is presented
  useEffect(() => {
    sendJsonMessage({
      event: 'subscribe',
      pair: [krakenURL],
      subscription: {
        name: 'ticker',
      },
    });
    return () => {
      sendJsonMessage({
        event: 'unsubscribe',
        pair: [krakenURL],
        subscription: {
          name: 'ticker',
        },
      });
    };
  }, [krakenURL, sendJsonMessage]);

  // Call handle new message when a new message is incoming
  useEffect(() => {
    handleResponse(lastJsonMessage);
  }, [handleResponse, lastJsonMessage]);

  return <KrakenContext.Provider value={{ price }}>{children}</KrakenContext.Provider>;
};

export default KrakenProvider;
