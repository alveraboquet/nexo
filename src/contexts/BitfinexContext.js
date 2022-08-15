import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import usePair from 'hooks/usePair';

/*
 * Context responsible for fetching prices data from Bitfinex Websocket API
 */

const BitfinexContext = createContext();
export const useBitfinex = () => useContext(BitfinexContext);

const BitfinexProvider = ({ children }) => {
  // Connect websocket to Bitfinex
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(process.env.REACT_APP_BITFINEX_URL);
  const { bitfinexURL } = usePair();
  // Store current change subscription used to unsubscribe when pair is changed
  const channel = useRef('');

  const [price, setPrice] = useState('Connecting...');
  // Handle new incoming message and update price data
  const handleMessage = useCallback((message) => {
    if (!message) return;
    if (message.event) {
      if (message.event === 'error') {
        setPrice('Not available');
      }
    }
    if (Array.isArray(message)) {
      if (Array.isArray(message[1])) {
        setPrice(message[1][6]);
      }
    }
  }, []);

  // Save current channel in ref
  const handleSaveChannel = useCallback((msg) => {
    if (!msg) return;
    if (!Array.isArray(msg)) {
      if (msg.event === 'subscribed') {
        channel.current = msg.chanId;
      }
    }
  }, []);

  // Subscribe and unsubscribe for changes in price when new pair is presented
  useEffect(() => {
    sendJsonMessage({
      event: 'subscribe',
      channel: 'ticker',
      symbol: bitfinexURL,
    });
    return () => {
      if (channel.current !== '') {
        sendJsonMessage({
          event: 'unsubscribe',
          chanId: channel.current,
        });
      }
    };
  }, [bitfinexURL, sendJsonMessage]);

  // Handles incoming messages
  useEffect(() => {
    handleSaveChannel(lastJsonMessage);
    handleMessage(lastJsonMessage);
  }, [handleSaveChannel, handleMessage, lastJsonMessage]);

  return <BitfinexContext.Provider value={{ price }}>{children}</BitfinexContext.Provider>;
};

export default BitfinexProvider;
