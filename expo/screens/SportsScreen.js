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
import SportsManager from '../util/SportsManager';

export default class SportsScreen extends Component {
  state = {
    sportsData: null,
    loadingSports: false
  }
  componentDidMount = () => {
    today = new Date();
    sportsManager.getData(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 30, this)
  }
  render() {
    return (
      <View>
        <View style={styles.linearLayoutBackground}>
          <Text style={styles.titleLight}>Upcoming Events</Text>
        </View>
        <View style={styles.linearLayout}>
          <GenerateSportsScreen data={this.state.sportsData} />
        </View>
      </View>
    );
  }
}

function GenerateSportsScreen(props) {
  sportsData = props["data"];
  if (sportsData === null) {
    return (
      <View style={{justifyContent: 'center', width: '100%'}}>
        <ActivityIndicator
          size="large"
          color="#0185DE"/>
      </View>
    )
  } else {
    sections = [];
    sportsDataKeys = Object.keys(sportsData);
    sportsDataKeys.sort();
    for (var i = 0; i < sportsDataKeys.length; i++) {
      dateString = sportsDataKeys[i];
      events = sportsData[dateString]["events"];
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

var sportsManager = new SportsManager("daily-bulletin");

SportsScreen.navigationOptions = {
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
