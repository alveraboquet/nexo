import React from 'react';
import './App.scss';
import BinanceProvider from 'contexts/BinanceContext';
import BitfinexProvider from 'contexts/BitfinexContext';
import KrakenProvider from 'contexts/KrakenContext';
import Router from 'router';
import HuobiProvider from './contexts/HuobiContext';

/*
 * Connect all providers and router
 */
function App() {
  return (
    <BinanceProvider>
      <BitfinexProvider>
        <KrakenProvider>
          <HuobiProvider>
            <Router />
          </HuobiProvider>
        </KrakenProvider>
      </BitfinexProvider>
    </BinanceProvider>
  );
}

export default App;
