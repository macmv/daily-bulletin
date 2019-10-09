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
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }
  //limit module from appearing more than once
  componentDidMount() {
    AsyncStorage.getItem(this.props.pagekey, (err, result) => {
      if (err) {
      } else {
        /*data = JSON.parse(result);
        if (data["value"] == null) {
          console.log("null value recieved", result);
          this.setModalVisible(true);
        } else {
          console.log("result", result);
        }*/
        this.setModalVisible(true);
        console.log("result", result);
      }
    });
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value": true}), (err,result) => {
      console.log("error",err,"result",result);
    });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  //display module popup
  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          style={styles.userInfoContainer}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
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
              selectedValue={this.state.language}
              style={styles.userInfoGradePicker}
              onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
              <Picker.Item label="9th Grade" value="9" />
              <Picker.Item label="10th Grade" value="10" />
              <Picker.Item label="11th Grade" value="11" />
              <Picker.Item label="12th Grade" value="12" />
            </Picker>
            <View style={styles.userInfoExitContainer}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <View style={styles.userInfoExitButtonContainer}>
                  <Text style={styles.userInfoExitButtonText}>Enter</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
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
		//borderRadius:20,
		//borderWidth:4,
		//borderColor:'#0185DE'
    elevation: 10
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
