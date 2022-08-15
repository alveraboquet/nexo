import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import usePair from 'hooks/usePair';

/*
 * Context responsible for fetching prices data from Huobi API via Local NodeJS server
 */

const TIME_INTERVAL_TO_REFETCH = Number(process.env.REACT_APP_REFRESH_TIME_INTERVAL); // Call local server in interval

const HuobiContext = createContext();
export const useHuobi = () => useContext(HuobiContext);

const HuobiProvider = ({ children }) => {
  const { normalizedPair } = usePair();
  const [price, setPrice] = useState('Connecting...');

  // Fetch data from local API
  const fetchData = useCallback(async () => {
    if (normalizedPair === '') return; // Do not fetch if there is no pair
    const response = await fetch(`${process.env.REACT_APP_HUOBI_URL}/${normalizedPair}`);
    const result = await response.json();
    setPrice(result.price);
  }, [normalizedPair]);

  // Call fetch data and set time interval for refetch on time period
  useEffect(() => {
    const getData = async () => {
      await fetchData();
    };
    const interval = setInterval(async () => {
      await fetchData();
    }, TIME_INTERVAL_TO_REFETCH);
    getData();
    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  return <HuobiContext.Provider value={{ price }}>{children}</HuobiContext.Provider>;
};

export default HuobiProvider;
