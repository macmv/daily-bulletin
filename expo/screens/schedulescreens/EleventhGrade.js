import React, {Component} from 'react';
import {View,Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
export default class EleventhGrade extends Component{
  render() {
    return(
      <View>
        <Text>This is Eleventh Grade</Text>
      </View>
    )
  }
}
/*EleventhGrade.navigationOptions={
  tabBarIcon:({tintColor, focused})=>(
    <Icon
      name={focused ? 'ios-home' : 'md-home'}
      color={tintColor}
      size={25}
    />
  )
}*/
