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
    sportsManager.getData(new Date(2019, 9, 28), 7, this)
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <GenerateSportsScreen data={this.state.sportsData} />
      </ScrollView>
    );
  }
}

function GenerateSportsScreen(props) {
  sportsData = props["data"];
  if (sportsData === null) {
    return (
      <View>
        <ActivityIndicator
          barStyle="large"
          color="#00ffa0"/>
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
            { events[j] }
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
      <View style={styles.linearLayout, {flex: 1, marginBottom: 100}}>
        { sections }
      </View>
    )
  }
  return null;
}

var sportsManager = new SportsManager("daily-bulletin");

SportsScreen.navigationOptions = {
  title: 'Sports',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  subtitle: {
    color: '#222',
    width: '100%',
    padding: 10,
    fontSize: 18
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
    padding: 10,
  },
});
