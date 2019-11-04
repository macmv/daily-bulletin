import React, {Component} from 'react';
import {View,Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
export default class TenthGrade extends Component{
    render() {
        return(
            <View>
                <Text>This is Tenth Grade</Text>
            </View>
        )
    }
}
/*TenthGrade.navigationOptions={
            tabBarIcon:({tintColor, focused})=>(
            <Icon
                name={focused ? 'ios-home' : 'md-home'}
                color={tintColor}
                size={25}
            />
        )
}*/
