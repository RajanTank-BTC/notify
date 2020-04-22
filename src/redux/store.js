import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { logger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-community/async-storage';
import rootReducer from './reducer';

export default (initialState = {}) => {

  const persistConfig = {
    key: 'reminder',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const middleware = applyMiddleware(thunkMiddleware, logger);

  const store = createStore(persistedReducer, initialState, middleware);

  const persistor = persistStore(store);

  return { store, persistor };
};