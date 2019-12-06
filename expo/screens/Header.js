import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.linearLayoutBackground}>
        <Text style={styles.titleLight}> { this.props.title } </Text>
        { this.props.children }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: '#26f',
    textDecorationLine: 'underline',
  },
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: '#0185DE',
    padding: 10
  },
});
