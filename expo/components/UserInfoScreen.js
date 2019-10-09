import React, { Component, PropTypes } from "react";
import {
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
            <View style={styles.userInfoExitContainer}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <View style={styles.userInfoExitButtonContainer}>
                  <Text style={styles.userInfoExitButtonText}>Exit</Text>
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
		backgroundColor:'black',
		flex:1,
		marginTop:70,
		marginBottom:40,
		marginLeft:20,
		marginRight:20,
		borderRadius:20,
		borderWidth:4,
		borderColor:'red'
	},
	userInfoTitle:{
		color:'white',
        fontWeight:'bold',
		fontSize:20,
		textAlign:'center',
		margin:10,
	},
	userInfoDescription:{
		color:'white',
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
		flex:6.5
	},
	userInfoExitContainer:{
		flex:2,
		justifyContent:'flex-start',
		alignItems:'center',
	},
	userInfoExitButtonContainer:{
		width:200,
		height:40,
		backgroundColor:'red',
		borderRadius:10,
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
