import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const store = configureStore({
  reducer: {
    Slice: reducer,
  },
});

export default store;
