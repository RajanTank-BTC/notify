import React, { Component } from 'react';
import { Platform, StyleSheet, Text, SafeAreaView, View, TextInput, ScrollView, } from 'react-native';
import { ListItem, Input, Button, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import GIFT from '../Gift.png'
import { connect } from 'react-redux'
import { addReminder, deleteReminder } from './redux/action'

class Dashboard extends Component {
  state = {
    enableNotification: true,
    isDateTimePickerVisible: false,
    notificationTime: moment(),
    notificationTitle: '',
    notificationDescription: '',
    notificationRepeat: ''
  };

  setReminder = () => {
    const { notificationTime, enableNotification } = this.state;

    const { notificationDescription, notificationTitle } = this.state
    let body = {
      title: notificationTitle,
      description: notificationDescription,
      time: notificationTime
    }
    const { addReminder } = this.props
    addReminder(body)
    this.resetState()
  };

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
      notificationTime: moment(date),
    });
  };

  render() {
    const { isDateTimePickerVisible,
      notificationTime, notificationTitle, notificationDescription } = this.state;
    const { reminder } = this.props
    console.log(reminder)
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
        <View style={styles.titleView}>
          <Input
            style={styles.titleinput}
            value={notificationTitle}
            onChangeText={(text) => this.setState({ notificationTitle: text })}
            placeholder="Title"
          />
          <Input
            multiline={true}
            numberOfLines={3}
            style={styles.titleinput}
            value={notificationDescription}
            onChangeText={(text) => this.setState({ notificationDescription: text })}
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

        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="time"
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
    reminder: state.reminders
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)