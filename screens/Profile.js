import React, { Component } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled : false,
      light_theme : true,
      profile_image : "",
      name : ""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser(){
    let theme,name,image 
    await firebase 
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value",function(snapshot){
        theme = snapshot.val().current_theme
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}` 
        image = snapshot.val().profile_picture
      })
      this.setState({
        light_theme : theme ===  "light" ? true : false,
        isEnabled : theme === "light" ? false : true,
        name : name ,
        profile_image : image
      })
  }

  toggleSwitch() { 
    const previous_state = this.state.isEnabled; 
    const theme = !this.state.isEnabled ? "dark" : "light"; 
    var updates = {}; 
    updates[ "/users/" + firebase.auth().currentUser.uid + "/current_theme" ] = theme; 
    firebase 
    .database() 
    .ref() 
    .update(updates); 
    this.setState({ isEnabled: !previous_state, light_theme: previous_state }); }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style = {styles.safeArea}/>
            <View style = {styles.appTitle}>
              <View style = {styles.appIcon}>
                <Image source = {require("assets/logo.png")}
                />
              </View>
              <View style = {styles.appTitleTextContainer}>
                <Text>Storytelling App</Text>
              </View>
            </View>
          <View style = {styles.screenContainer}>
            <View style = {styles.profileImageContainer}>
              <Image source = {{uri:this.state.profile_image}}
              style = {styles.profileImage}/>
              <Text style = {styles.nameText}>{this.state.name}</Text>
            </View>
            <View style = {styles.themeContainer}>
              <Text>Dark Theme</Text>
              <Switch style = {{transform:[{scaleX : 1.3},{scaleY : 1.3}]}}
              trackColor = {{false:"gray",true : "white"}}
              thumbColor = {this.state.isEnabled?"lavender" : "orange"}
              ios_backgroundColor = "violet"
              onValueChange = {()=>this.toggleSwitch()}
              value = {this.state.isEnabled}></Switch>
            </View>
          </View>
          <Text>Profile</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
