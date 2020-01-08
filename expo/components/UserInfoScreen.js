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
    //console.log("Setting grade to: " + grade);
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
      //console.log(this.props.pagekey + " : " + JSON.parse(result)["grade"]);
      if (!err) {
        if (result == null) {
          //if result is null
          //console.log("null value recieved");
          this.state.modalLoaded = true;
          this.state.firstTimePopup = true;
          //console.log("Modal Loaded and got null: " + this.state.modalLoaded);
          this.setState({grade: "9"});
        } else {
          //otherwise, load in grade
          data = JSON.parse(result);
          this.state.modalLoaded = true;
          this.state.firstTimePopup = true;
          //console.log("Modal Loaded and got result: " + this.state.modalLoaded);
          //console.log("result", data["grade"]);
          this.setState({grade: data["grade"]});
        }
      }
    });
  }
  //display module popup
  render() {
    //console.log("this.state.firstTimePopup: " + this.state.firstTimePopup);
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
              <Picker
                selectedValue={this.state.grade + ""}
                style={styles.userInfoGradePicker}
                onValueChange={(itemValue, itemIndex) => this.setGrade(parseInt(itemValue))}>
                <Picker.Item label="9th Grade" value="9" />
                <Picker.Item label="10th Grade" value="10" />
                <Picker.Item label="11th Grade" value="11" />
                <Picker.Item label="12th Grade" value="12" />
              </Picker>
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
  userInfoContainer:{
    backgroundColor:'white',
    flex:1,
    marginTop:70,
    marginBottom:40,
    marginLeft:20,
    marginRight:20,
    elevation: 10,
    shadowOffset: {width: 10, height: 10}
  },
  userInfoTitle:{
    color:'black',
        fontWeight:'bold',
    fontSize:20,
    textAlign:'center',
    margin:10,
  },
  userInfoDescription:{
    color:'black',
        fontSize:15,
    marginRight:20,
    marginLeft:20
  },
  userInfoCloseIcon:{
    alignSelf:'flex-end',
    flex:0.5,
    marginRight:10
  },
  userInfoTitleContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  userInfoDescriptionContainer:{
    flex:1
    //6.5
  },
  userInfoGradePicker: {
    flex: 3,
    alignSelf: 'center',
    width: "50%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  userInfoExitContainer:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
  },
  userInfoExitButtonContainer:{
    width:"100%",
    height:"50%",
    padding: 20,
    borderRadius: 2,
    elevation: 5,
    backgroundColor:'#B61901',
    justifyContent:'center',
  },
  userInfoExitButtonText:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center'
  }
});
//export default styles;
