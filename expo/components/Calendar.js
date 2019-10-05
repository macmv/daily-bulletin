import React, {
  Component
} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList
} from 'react-native';

import moment from 'moment';
import PropTypes from 'prop-types';

export class Calendar extends Component {
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
          <Text style={styles.title}>{moment(this.props.month).format('MMMM, YYYY')}</Text>
          <Button title="Next" onPress={() => {
            this.props.bulletinScreen.setMonth(new Date(this.props.month.getFullYear(), this.props.month.getMonth() + 1, 1));
          }}/>
        </View>
        <FlatList style={styles.linearLayoutVertical}
          data={data}
          numColumns={7} // because its a calendar. This isn't going to change
          rowHasChanged={({data}) => rowHasChanged(data)}
          renderItem={({item}) => <View style={styles.number}>{item.content}</View>}
        />
      </View>
    )

    return component;
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20
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
  number: {
    flex: 1,
    aspectRatio: 1,
    margin: 5
  }
});
