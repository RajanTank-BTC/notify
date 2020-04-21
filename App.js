import React, { Component } from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';

import MainApp from './src/MainApp'

export default class App extends Component {


  render() {
    // console.log(firebase)
    // console.log(firebase.notifications().android.getChannels())
    return <MainApp />;
  }
}