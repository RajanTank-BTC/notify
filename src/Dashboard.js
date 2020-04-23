import React, { Component } from 'react';
import { Platform, StyleSheet, Text, SafeAreaView, View, TextInput, ScrollView, } from 'react-native';
import { ListItem, Input, Button, Icon, Overlay } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import GIFT from '../Gift.png'
import { connect } from 'react-redux'
import { addReminder, deleteReminder } from './redux/action'
import { fcmService } from './FCMservice'

class Dashboard extends Component {
  state = {
    enableNotification: true,
    isDateTimePickerVisible: false,
    notificationTime: moment(),
    notificationTitle: '',
    notificationDescription: '',
    notificationRepeat: '',
    errorMsgTitle: '',
    errorMsgDes: '',
    timeerror: false,
    isVisibleOverlay: false
  };

  componentDidMount() {
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }

  onRegister = (token) => {
    console.log("[Notification fcm ] onRegister:", token)
  }

  onNotification = (notify) => {
    console.log("[Notification fcm ] : onNotification:", notify)
    const notification = fcmService.buildNotification(this.createNotification(notify))
    fcmService.displayNotification(notification)
  }

  onOpenNotification = (notify) => {
    console.log("[Notification Fcm ] : onOpenNotification ", notify)
    // alert("Open Notification :" + notify._data.title)
    this.setState({ notifyData: notify._data }, () => this.setState({ isVisibleOverlay: true }))
  }

  setReminder = () => {
    const { notificationTime, enableNotification } = this.state;
    const { notificationDescription, notificationTitle } = this.state
    let status = moment(notificationTime).isAfter(moment().add(10, "m"))
    if (!status) {
      this.setState({
        timeerror: true
      })
    }
    // else {
    if (notificationDescription == '' || notificationTitle === '') {
      if (notificationTitle == '') {
        this.setState({ errorMsgTitle: 'Enter title please' })
      }
      if (notificationDescription === '') {
        this.setState({ errorMsgDes: 'Enter dec please' })
      }
    }
    else {
      let body = {
        bodyForLocal: {
          title: notificationTitle,
          description: notificationDescription,
          time: notificationTime
        },
        bodyForSchdeule: {
          _title: notificationTitle,
          _body: notificationDescription,
          _data: {
            title: notificationTitle,
            body: notificationDescription,
          },
          _notificationId: Math.random().toString(),
          time: notificationTime
        }
      }
      const { addReminder } = this.props
      addReminder(body.bodyForLocal)
      this.scheduleReminder(body.bodyForSchdeule)
      this.resetState()
    }
    // }
  };

  scheduleReminder = (data) => {
    const notification = fcmService.buildNotification(this.createNotification(data))
    console.log("notification ", notification)
    fcmService.scheduleNotification(notification, data.time)
  }


  createNotification = (notify) => {
    console.log(notify)
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
      data: notify._data,
      colorBgIcon: "#1A243B",
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      vibrate: true,
      dataId: notify._notificationId
    }
    return buildNotify
  }

  resetState = () => {
    this.setState({
      notificationTime: moment(),
      notificationTitle: '',
      notificationDescription: ''
    })
  }

  deleteReminder = (item) => {
    const { deleteReminder } = this.props
    deleteReminder(item)
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();

    this.setState({
      timeerror: false,
      notificationTime: moment(date),
    });
  };

  render() {
    const { isDateTimePickerVisible,
      notificationTime, notificationTitle, notificationDescription,
      errorMsgDes, errorMsgTitle, timeerror, notifyData } = this.state;
    const { reminder, state } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cardTitleView}>
          <Text style={styles.cardTitle}>Add Reminder</Text>
        </View>
        <ListItem
          title="Time"
          titleStyle={styles.titleStyle}
          onPress={this.showDateTimePicker}
          rightElement={<Text style={{ opacity: 0.7 }}>{moment(notificationTime).format('LT')}</Text>}
        />
        {timeerror &&
          <Text style={{ marginLeft: 10 }}>You can set time after 10 minutes of current time</Text>}
        <View style={styles.titleView}>
          <Input
            style={styles.titleinput}
            value={notificationTitle}
            onChangeText={(text) => this.setState({ notificationTitle: text, errorMsgTitle: '' })}
            placeholder="Title"
            errorMessage={errorMsgTitle}
          />
          <Input
            errorMessage={errorMsgDes}
            multiline={true}
            numberOfLines={3}
            style={styles.titleinput}
            value={notificationDescription}
            onChangeText={(text) => this.setState({ notificationDescription: text, errorMsgDes: '' })}
            placeholder="Description"
          />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Button
            title="Add reminder"
            buttonStyle={{ width: 200, height: 40 }}
            onPress={() => this.setReminder()}
          />
        </View>
        <View style={{ display: 'flex', height: 500 }}>
          <ScrollView>
            {reminder.length > 0 && reminder.map(item => {
              return (
                <ListItem
                  title={item.title}
                  subtitle={item.description}
                  titleStyle={styles.titleStyle}
                  subtitleStyle={styles.subtitleStyle}
                  rightIcon={<Icon
                    name="trash"
                    type="font-awesome"
                    onPress={() => this.deleteReminder(item)} />}
                />
              )
            })
            }
          </ScrollView>
        </View>
        <Overlay
          isVisible={this.state.isVisibleOverlay}
          onBackdropPress={() => this.setState({ isVisibleOverlay: false })}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ margin: 20, fontSize: 20, fontWeight: '600' }}>{notifyData && notifyData.title}</Text>
            <Text style={{ margin: 20, fontSize: 16 }}>{notifyData && notifyData.body}</Text>
          </View>
        </Overlay>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="datetime"
          is24Hour={false}
          date={new Date(notificationTime)}
          titleIOS="Pick your Notification time"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF0',
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 20,
    color: '#585858',
  },
  subtitleStyle: {
    fontSize: 16,
    color: '#585858',
  },
  titleView: {
    margin: 20,
    backgroundColor: '#EEEFF0',
  },
  titleinput: {
    fontSize: 20,
    fontWeight: '600',
    margin: 5,
    backgroundColor: "#fff"
  }
});

const mapDispatchToProps = {
  addReminder,
  deleteReminder
}

const mapStateToProps = (state) => {
  return ({
    state: state,
    reminder: state.reminders
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)