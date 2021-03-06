import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,I18nManager  } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button } from 'native-base'

import axios from "axios";
import CONST from "../consts";

class About extends Component {

  constructor(props){
    super(props);
    this.state = {
        aboutUs: '',
    };
    I18nManager
  }

  componentWillMount() {

    I18nManager.forceRTL(true);

    axios({
        url: CONST.url + 'aboutApp',
        method: 'GET',
    }).then(response => {
       
      this.setState({
          aboutUs :  response.data.data
      });
       
    }).catch(err => { 
      console.log(err);
    });
  }

  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>الداعمين</Text> ) ,
    drawerIcon  : ( <Icon style={styles.icon} type="FontAwesome5" name="users" /> )
  });

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>الداعمين</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.blockAbout}>
                    <Text style={styles.text}>{ this.state.aboutUs }</Text>
                </View>
            </View>
            
        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor     : "#dba261",
    borderBottomColor   : "#dba261",
    paddingRight        : 0,
    paddingLeft         : 0,
    paddingTop          : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    height              : 90
  },
  bodyText : {
    alignItems          : 'flex-end',
  },
  contentView : {
    backgroundColor     : '#dba261',
  },
  bgImage : {
    flex                : 1,
    backgroundColor     : '#fff',
  },
  Title : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 17,
    backgroundColor     : "#504b45",
    width               : 150,
    paddingTop          : 5,
    paddingBottom       : 5,
    borderBottomRightRadius  : 10,
    borderTopRightRadius     : 10,
  },
  textLabel : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 18,
    marginVertical      : 8
  },
  text :{
    color               : "#a1a5ab",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    paddingHorizontal   : 10,
    textAlign           : "center"
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : -77,
  },
  upBlock : {
    minHeight           : 140,
  },
  bgDiv : {
    paddingRight        : 10,
    paddingLeft         : 10,
  },
  icon : {
    color               : "#FFF",
    fontSize            : 23,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 25,
  },
  
});


export default About;