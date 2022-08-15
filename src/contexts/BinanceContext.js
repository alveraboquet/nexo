import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import usePair from 'hooks/usePair';

/*
 * Context responsible for fetching prices data from Binance Websocket API
 */

const BinanceContext = createContext();
export const useBinance = () => useContext(BinanceContext);

const BinanceProvider = ({ children }) => {
  // Connect websocket to Binance
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(process.env.REACT_APP_BINANCE_URL);
  const { pair, binanceURL } = usePair();
  const [price, setPrice] = useState('Connecting...');

  // Handle price change on new message received
  const handleMessage = useCallback((message) => {
    if (!message) return;
    if (Object.keys(message).indexOf('result') !== -1) {
      setPrice('Not available');
    }
    if (message.data) {
      if (message.stream.indexOf('@miniTicker') !== -1) {
        setPrice(message.data.c);
      }
    }
  }, []);

  // Subscribe and unsubscribe for socket pair message event
  useEffect(() => {
    sendJsonMessage({
      method: 'SUBSCRIBE',
      params: [`${binanceURL}@miniTicker`],
      id: 1,
    });
    return () => {
      sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: [`${binanceURL}@miniTicker`],
        id: 1,
      });
    };
  }, [binanceURL, sendJsonMessage]);

  // Handle new message incoming from socket
  useEffect(() => {
    handleMessage(lastJsonMessage);
  }, [handleMessage, lastJsonMessage]);

  return (
    <BinanceContext.Provider value={{ price, currentPair: pair.join('/') }}>
      {children}
    </BinanceContext.Provider>
  );
};

export default BinanceProvider;
