import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import userDetailsReducer from '../slice/userDetailsSlice';
import EncryptedStorage from 'react-native-encrypted-storage';

// 1. Fix storage engine
const encryptedStorage = {
  setItem: async (key, value) => {
    await EncryptedStorage.setItem(key, value);
    return Promise.resolve();
  },
  getItem: async (key) => {
    const value = await EncryptedStorage.getItem(key);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    await EncryptedStorage.removeItem(key);
    return Promise.resolve();
  },
};

// 2. Proper persist config
const persistConfig = {
  key: 'root',
  storage: encryptedStorage,
  whitelist: ['userDetails'],
  stateReconciler: (inboundState, originalState) => ({
    ...originalState,
    userDetails: inboundState.userDetails, // Exclude _persist from userDetails
  }),
};

// 3. Fixed middleware setup
const autoSaveMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState().userDetails;
  
  if(state.email) {
    EncryptedStorage.setItem(`user_${state.email}`, JSON.stringify(state))
      .catch(error => console.error('Auto-save failed:', error));
  }
  
  return result;
};

const persistedReducer = persistReducer(persistConfig, userDetailsReducer);

// 4. Correct store configuration
export const store = configureStore({
  reducer: {
    userDetails: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(autoSaveMiddleware), // Directly reference middleware
});

export const persistor = persistStore(store);
