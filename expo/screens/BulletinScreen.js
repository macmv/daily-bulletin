import * as WebBrowser from 'expo-web-browser';
import React, {
  Component
} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Modal from "react-native-modal";
import { MonoText } from '../components/StyledText';
import BulletinManager from '../util/BulletinManager';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class BulletinScreen extends Component {
  state = {
    isModalVisible: false,
    bulletinData: null,
    loadingBulletin: false
  };

  showPopup = () => {
    bulletinManager.getAvailableDates(new Date(), this);
    this.setState({isModalVisible: true, selectedMonth: new Date()});
  };

  hidePopup = () => {
    this.setState({isModalVisible: false});
  };

  onSelectDate = (date) => {
    this.setState({loadingBulletin: true, selectedDate: date});
    bulletinManager.getData(date, this);
    this.hidePopup();
  }

  setMonth(month) {
    console.log("Setting month to: " + month);
    bulletinManager.getAvailableDates(month, this);
    this.setState({selectedMonth: month});
  }

  render() {
    return (
      <View>
        <View style={styles.linearLayoutBackground}>
          <Text style={styles.titleLight}>NHHS Daily Bulletin</Text>
          <Button onPress={this.showPopup} style={styles.calendarButton} title="Calendar"/>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.linearLayoutVerticalBackground}>
            <Calendar isModalVisible={this.state.isModalVisible} validDates={this.state.validDates} month={this.state.selectedMonth} bulletinScreen={this} onPress={this.onSelectDate}/>
            <View style={{flexDirection: 'row'}}>
              {this.state.loadingDates ?
                <ActivityIndicator size="small" color="#00ff00" /> : null}
              <View style={{flex:1}}/>
              <Button onPress={this.hidePopup} title="Ok"/>
            </View>
          </View>
        </Modal>
        <View style={styles.linearLayout}>
          <BulletinElement date={this.state.selectedDate} bulletin={this.state.bulletinData} loading={this.state.loadingBulletin} />
        </View>
      </View>
    );
  }
}

var bulletinManager = new BulletinManager("daily-bulletin")

function BulletinElement(props) {
  if (props.loading) {
    return (
      <View style={styles.linearLayout}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  } else {
    bulletin = props.bulletin
    if (bulletin === null) {
      return (
        <View style={styles.linearLayout}>
        </View>
      )
    }
    sections = [];
    sections.push(
      <View>
        <Text style={styles.title}>Sports</Text>
        <Text style={styles.text}></Text>
      </View>
    )
    for (i = 1; i < bulletin.sports.length; i++) {
      sections.push(
        <View>
          <Text style={styles.text}>{bulletin.sports[i]}</Text>
          <Text style={styles.text}></Text>
        </View>
      )
      key += 2;
    }
    sections.push(
      <View>
        <Text style={styles.title}>Other</Text>
        <Text style={styles.text}></Text>
      </View>
    )
    for (i = 1; i < bulletin.other.length; i++) {
      sections.push(
        <View>
          <Text style={styles.text}>{bulletin.other[i]}</Text>
          <Text style={styles.text}></Text>
        </View>
      )
      key += 2;
    }
    return (
      <ScrollView style={styles.linearLayout, {flex: 1, marginBottom: 100}}>
        <Text style={styles.title}>Daily bulletin for {moment(props.date).format('dddd, MMMM Do YYYY')}</Text>
        {sections}
      </ScrollView>
    )
  }
}

class Calendar extends Component {
  static propTypes = {
    validDates: PropTypes.array,
    month: PropTypes.object,
    bulletinScreen: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    isModalVisible: PropTypes.bool.isRequired
  }

  prevData = [];

  rowHasChanged = (data) => {
    hasChanged = this.prevData.length != data.length;
    this.prevData = data;
    return hasChanged;
  }

  render = () => {
    var date = this.props.month;
    var year = date.getFullYear();
    var month = date.getMonth();
    var firstDay = new Date(year, month, 1);
    var startDayOfWeek = firstDay.getDay(); // 0 = sunday, 6 = saturday
    var daysInMonth = new Date(year, month + 1, 0).getDate(); // js magic

    var data = [];

    for (var i = 0; i < 5 * 7; i++) {
      day = i - startDayOfWeek + 1;
      if (day > 0 && day <= daysInMonth) {
        disabled = !this.props.validDates.includes(new Date(year, month, day).getTime());
        buttonDate = new Date(date.getFullYear(), date.getMonth(), day);
        data.push({
          content: <Button disabled={disabled} title={day.toString()} onPress={this.props.onPress.bind(this, buttonDate)} />,
          key: i
        });
      } else {
        data.push({
          content: null,
          key: i
        });
      }
    }

    component = (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.linearLayout}>
          <Button title="Prev" onPress={() => {
            this.props.bulletinScreen.setMonth(new Date(this.props.month.getFullYear(), this.props.month.getMonth() - 1, 1));
          }}/>
          <Text style={styles.text}>{moment(this.props.month).format('MMMM, YYYY')}</Text>
          <Button title="Next" onPress={() => {
            this.props.bulletinScreen.setMonth(new Date(this.props.month.getFullYear(), this.props.month.getMonth() + 1, 1));
          }}/>
        </View>
        <FlatList style={styles.linearLayoutVertical}
          data={data}
          numColumns={7}
          rowHasChanged={({data}) => rowHasChanged(data)}
          renderItem={({item}) => <View style={styles.calendarNumber}>{item.content}</View>}
        />
      </View>
    )

    return component;
  }
}

BulletinScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  title: {
    color: '#222',
    textAlign: 'center',
    width: '100%',
    padding: 20,
    fontSize: 20
  },
  textLight: {
    color: '#fff',
    fontSize: 20,
  },
  text: {
    color: '#222',
    fontSize: 15,
  },
  toolbar: {
    backgroundColor: '#fff',
    padding: 20,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    height: 56,
    alignSelf: 'stretch',
    textAlign: 'left'
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  linearLayout: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  linearLayoutVertical: {
    flex: 0,
    flexDirection: "column",
    padding: 10
  },
  linearLayoutVerticalBackground: {
    flex: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  calendarButton: {
    backgroundColor: '#0185DE',
    color: "#fff",
    width: 20,
    height: 20
  },
  calendarNumber: {
    flex: 1,
    aspectRatio: 1,
    margin: 5
  }
});
