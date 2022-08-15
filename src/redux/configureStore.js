import { configureStore } from '@reduxjs/toolkit';
import trades from 'redux/reducers/trades/reducer';

// Basic redux configuration responsible for trades fetched data
export const store = configureStore({
  reducer: {
    trades,
  },
});
