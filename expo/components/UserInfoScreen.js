import React, { Component, PropTypes } from "react";
import {
  Picker,
  AsyncStorage,
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from "react-native";

export default class UserInfoScreen extends Component {
  //TODO: Increment the User's grade every school year automatically
  state = {
    grade: 9,
    modalLoaded: false,
    firstTimePopup: false,
  }
  //pagekey: "gradepopup"
  //previousVisible: null
  setGrade = (grade) => {
    this.setState({grade: grade});
  }
  exitUserInfoScreen = () => {
    //store user's Grade
    AsyncStorage.setItem("gradekey", JSON.stringify({"grade": this.state.grade}), (err,result) => {
      console.log("error",err,"result",result);
    });
    console.log("Setting grade to: " + this.state.grade);
    this.state.firstTimePopup = false;
    //hide modal
    this.props.hide();
  }
  //only called when the component is first being mounted in the app
  componentDidMount() {
    //get the grade that was saved
    AsyncStorage.getItem("gradekey", (err, result) => {
      if (!err) {
        if (result == null) {
          //if result is null
          this.state.modalLoaded = true;
          this.state.firstTimePopup = true;
          this.setState({grade: "9"});
        } else {
          //otherwise, load in grade
          data = JSON.parse(result);
          this.state.modalLoaded = true;
          this.state.firstTimePopup = true;
          this.setState({grade: data["grade"]});
        }
      }
    });
  }
  //display module popup
  render() {
    if ((this.state.modalLoaded && this.props.visible) || this.state.firstTimePopup) {
      return (
        <View>
          <Modal
            animationType={"slide"}
            transparent={true}
            style={styles.userInfoContainer}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}>
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfoTitleContainer}>
                <Text style={styles.userInfoTitle}>{this.props.title}</Text>
              </View>
              <View style={styles.userInfoDescriptionContainer}>
                <Text style={styles.userInfoDescription} allowFontScaling={true}>
                  {this.props.description}
                </Text>
              </View>
              <View style={styles.gradeSelector}>
                <Text style={styles.gradeSelectorText}>Grade:</Text>
                <Picker
                  selectedValue={this.state.grade + ""}
                  style={styles.gradeSelectorPicker}
                  onValueChange={(itemValue, itemIndex) => this.setGrade(parseInt(itemValue))}>
                  <Picker.Item label="9th Grade" value="9" />
                  <Picker.Item label="10th Grade" value="10" />
                  <Picker.Item label="11th Grade" value="11" />
                  <Picker.Item label="12th Grade" value="12" />
                </Picker>
              </View>
              <View style={styles.userInfoExitContainer}>
                <TouchableHighlight
                  onPress={this.exitUserInfoScreen} >
                  <View style={styles.userInfoExitButtonContainer}>
                    <Text style={styles.userInfoExitButtonText}>Save</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
      return <View />
    }
  }
}

//define styles
const styles = StyleSheet.create({
  gradeSelector: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    height: '100%',
  },
  gradeSelectorText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  gradeSelectorPicker: {
    flex: 1,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    marginTop: 70,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
    elevation: 10,
    shadowOffset: {width: 10, height: 10},
    flexDirection: 'column',
    flex: 1
  },
  userInfoTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  userInfoDescription: {
    color: 'black',
    fontSize: 15,
    marginRight: 20,
    marginLeft: 20
  },
  userInfoCloseIcon: {
    alignSelf: 'flex-end',
    flex: 0.5,
    marginRight: 10
  },
  userInfoTitleContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userInfoDescriptionContainer: {
    justifyContent: 'center',
    flex: 1
  },
  userInfoExitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoExitButtonContainer: {
    width: "100%",
    height: "50%",
    padding: 20,
    borderRadius: 2,
    elevation: 5,
    backgroundColor: '#B61901',
    justifyContent: 'center',
  },
  userInfoExitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
