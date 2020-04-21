import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { AppState } from 'react-native'

const channel = new firebase.notifications.Android.Channel(
  "test-channel",
  "Test Channel",
  firebase.notifications.Android.Importance.High
).setDescription("My apps test channel");

firebase.notifications().android.createChannel(channel);


export default async (message) => {
  // handle your message

  // const currentAppState = AppState.currentState


  // AppState.addEventListener("change", nextAppstate => {
  //   if (currentAppState === "active" && nextAppState === "uninitialized") {
  //     // I named the item key `FCM.BG_MESSAGE` but you can name it what you want.
  //     // Then, serialise the data to JSON, because AsyncStorage only allow strings as value
  //     AsyncStorage.setItem("FCM.BG_MESSAGE", JSON.stringify(message.data));
  //   }
  // });
  console.log(message)

  const newNotification = new firebase.notifications.Notification()
    .android.setChannelId(message.data.channelId)
    .setNotificationId(message.messageId)
    .setTitle(message.data.title)
    .setBody(message.data.body)
    .setSound("default")
    .setData(message.data)
    .android.setAutoCancel(true)
    .android.setSmallIcon('ic_launcher')

  // Build a channel
  // const channel = new firebase.notifications.Android.Channel(message.data.channelId, "SampleChannelName", firebase.notifications.Android.Importance.High);

  // Create the channel
  // firebase.notifications().android.createChannel(channel);
  firebase.notifications().displayNotification(newNotification)


  return Promise.resolve();
}