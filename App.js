import React, { Component } from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import MainApp from './src/MainApp'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './src/redux/store'

export default class App extends Component {

  render() {
    const { store, persistor } = configureStore()
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainApp />
        </PersistGate>
      </Provider>
    );
  }
}