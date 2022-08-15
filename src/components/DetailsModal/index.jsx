import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, selectTrades } from 'redux/reducers/trades/reducer';
import { ProviderTable, ModalWrapper } from 'components';
import usePair from 'hooks/usePair';

const TIME_INTERVAL_TO_REFETCH = Number(process.env.REACT_APP_REFRESH_TIME_INTERVAL);

/*
 * Modal presenting the last trades on all providers
 * Calls local API on a time period to update UI with lates 5 new trades for all
 * providers
 */

const DetailsModal = ({ isOpen }) => {
  const { normalizedPair } = usePair();
  const trades = useSelector(selectTrades);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getTrades(normalizedPair));
    }, TIME_INTERVAL_TO_REFETCH);
    dispatch(getTrades(normalizedPair));
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, normalizedPair]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={`Last trades for ${normalizedPair}`}>
      <div className={'grid grid-cols-2 gap-2'}>
        <ProviderTable data={trades.binance} provider={'Binance'} />
        <ProviderTable data={trades.bitfinex} provider={'Bitfinex'} />
        <ProviderTable data={trades.huobi} provider={'Huobi'} />
        <ProviderTable data={trades.kraken} provider={'Kraken'} />
      </div>
      <div className={'flex items-center justify-end'}>
        <button
          onClick={handleClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DetailsModal;
