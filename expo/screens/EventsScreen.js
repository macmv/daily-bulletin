import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import moment from 'moment';
import Header from './Header';
import EventsManager from '../util/EventsManager';

export default class EventsScreen extends Component {
  state = {
    eventsData: null,
    loadingEvents: false
  }
  componentDidMount = () => {
    today = new Date();
    eventsManager.getData(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 30, this)
  }
  render() {
    return (
      <View>
        <Header title={"Upcoming Events"} />
        <View style={styles.linearLayout}>
          <GenerateEventsScreen data={this.state.eventsData} />
        </View>
      </View>
    );
  }
}

function GenerateEventsScreen(props) {
  eventsData = props["data"];
  if (eventsData === null) {
    return (
      <View style={{justifyContent: 'center', width: '100%'}}>
        <ActivityIndicator
          size="large"
          color="#0185DE"/>
      </View>
    )
  } else {
    sections = [];
    eventsDataKeys = Object.keys(eventsData);
    eventsDataKeys.sort();
    for (var i = 0; i < eventsDataKeys.length; i++) {
      dateString = eventsDataKeys[i];
      events = eventsData[dateString]["events"];
      lines = []
      for (var j = 0; j < events.length; j++) {
        lines.push(
          <Text style={styles.text}>
            <Text>- </Text>
            <Text>{ events[j] }</Text>
          </Text>);
      }
      date = new Date(parseInt(dateString));
      sections.push(
        <View>
          <Text style={styles.subtitle}>{ moment(date).format('dddd, MMMM Do') }</Text>
          <View>
            { lines }
          </View>
        </View>);
    }
    return (
      <ScrollView style={styles.linearLayout, {flex: 1, marginBottom: 100}}>
        { sections }
      </ScrollView>
    )
  }
}

var eventsManager = new EventsManager("daily-bulletin");

EventsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  subtitle: {
    color: '#a22',
    width: '100%',
    padding: 10,
    fontSize: 18,
  },
  text: {
    color: '#222',
    paddingLeft: 25,
    fontSize: 15,
  },
  linearLayout: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
  },
});
