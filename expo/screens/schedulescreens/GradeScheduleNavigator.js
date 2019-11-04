import React, {Component} from 'react';
import {
  View
} from 'react-native';
import NinthGrade from "./NinthGrade";
import TenthGrade from "./TenthGrade";
import EleventhGrade from "./EleventhGrade";
import TwelvethGrade from "./TwelvethGrade";

export default class GradeScheduleNavigator extends Component {
  render() {
    switch (this.props.currentGrade) {
      case (9):
        return (
          <View>
            <NinthGrade/>
          </View>
        )
      break;
      case (10):
        return (
          <View>
            <TenthGrade/>
          </View>
        )
      break;
      case (11):
        return (
          <View>
            <EleventhGrade/>
          </View>
        )
      break;
      case (12):
        return (
          <View>
            <TwelvethGrade/>
          </View>
        )
      break;
    }
  }
}

// {
//   NinthGrade: NinthGrade,
//   TenthGrade: TenthGrade,
//   EleventhGrade: EleventhGrade,
//   TwelvethGrade: TwelvethGrade,
// },
// {
//   tabBarOptions: {
//     activeTintColor: 'white',
//     showIcon: false,
//     showLabel: true,
//     style: {
//       backgroundColor:'red'
//     }
//   },
// }
//  GradeScheduleNavigator =
// module.exports.default = createAppContainer(GradeScheduleNavigator);
