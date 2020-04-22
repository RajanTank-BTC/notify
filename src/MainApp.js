import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { fcmService } from './FCMservice'
import AsyncStorage from '@react-native-community/async-storage';
import DashBoard from './Dashboard'

export default class MainApp extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {

    // try {
    //   const dataFromBGTask = await AsyncStorage.getItem("FCM.BG_MESSAGE").then(
    //     jsonData => (jsonData ? JSON.parse(jsonData) : null)
    //   );

    //   console.log("This data is set from your BG Task handler", dataFromBGTask);
    //   // clear the stored FCM.BG_MESSAGE
    //   AsyncStorage.setItem("FCM.BG_MESSAGE", "");
    // } catch (e) {
    //   console.log(e);
    // }

    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }

  onRegister = (token) => {
    console.log("[Notification fcm ] onRegister:", token)
  }

  onNotification = (notify) => {
    console.log("[Notification fcm ] : onNotification:", notify)

    const channelObj = {
      channelId: "SmapleChannelID",
      channelName: "SmapleChannelName",
      channelDes: "SmapleChannelDes"
    }

    const channel = fcmService.buildChannel(channelObj)
    console.log(channel)
    const buildNotify = {
      title: notify._title,
      content: notify._body,
      sound: 'default',
      channel: channel,
      data: {},
      colorBgIcon: "#1A243B",
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      vibrate: true,
      dataId: notify._notificationId
    }

    const notification = fcmService.buildNotification(buildNotify)
    fcmService.displayNotification(notification)
  }

  onOpenNotification = (notify) => {
    console.log("[Notification Fcm ] : onOpenNotification ", notify)
    alert("Open Notification :" + notify._body)
  }

  render() {
    let { container } = style
    return (
      <View style={container}>
        <DashBoard />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: 'center'
  }
})