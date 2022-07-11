import { configureStore } from '@reduxjs/toolkit';
import auth from './reducers/auth';

export const store = configureStore({
  reducer: {
    auth: auth
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

