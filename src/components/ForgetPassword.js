import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity,KeyboardAvoidingView  } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Icon, Title,Toast } from 'native-base'

import Spinner from 'react-native-loading-spinner-overlay';

import axios from "axios";
import CONST from "../consts";

class ForgetPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      spinner       : false,
      phone         : ""
    };
  }


  componentWillMount() {
    
    I18nManager.forceRTL(true)

  }

  sentCode(){

    this.setState({spinner  :  true});

    axios({
      url       : `${CONST.url}auth/sendResetPassword`,
      method    : 'POST',
      data      : {
        phone   : this.state.phone
      }
      
    }).then(response => {

      Toast.show({ 
        text        : response.data.message, 
        duration    : 2000,
        type        : response.data.success === true ? "success" : "danger",
        textStyle   : { 
          color       : "white",
          fontFamily  : 'CairoRegular',
          textAlign   : 'center' 
        } 
      });

      this.setState({
        user_id     : response.data.data.user.id,
        spinner     :  false,
      });

      if(response.data.success === true){
        this.props.navigation.navigate('newpassword',{ user_id : this.state.user_id});
      }

    }).catch(err => {
      console.log(err);
      this.setState({spinner : false});
    });
  }

  render() {

    const img  =  
    <View style = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style={{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    return (
      <Container>
        
        <Spinner 
        visible           = { this.state.spinner }
    />
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <KeyboardAvoidingView behavior={'padding'} style={{ flex : 1 }}>
        <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>
        <View style={styles.bgImage}>
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgDiv}>
              <Text style={styles.text}>ادخال رقم الجوال للحصول علي كلمه مرور جديده</Text>
              <Form style={styles.formControl}>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>رقم الجوال</Label>
                  <Input style={styles.input}  keyboardType={'number-pad'} placeholderTextColor="#bbb" onChangeText={(phone) => this.setState({phone})}  value={ this.state.phone }/>
                </Item>
                <TouchableOpacity onPress={() => this.sentCode()} style={styles.touchBtn}>
                    <Text style={styles.textBtn}>ارسال</Text>
                </TouchableOpacity>
              </Form>
            </View>
        </View>
        </KeyboardAvoidingView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    contentView : {
      backgroundColor     : '#dba261',
    },
    bgImage : {
      flex                : 1,
      backgroundColor     : '#fff',
    },
    text : {
      color               : "#3b2d1d",
      position            : "relative",
      zIndex              : 99,
      fontFamily          : "CairoRegular",
      textAlign           : "center",
      fontSize            : 18,
      width               : 250,
      alignItems          : 'center', 
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    logo : {
      transform           : [{ scale: 0.3 }],  
      alignItems          : 'center', 
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    curve : {
      width               : '100%',
      height              : 80,
      zIndex              : 99,
      position            : 'absolute',
      top                 : -77,
    },
    bgDiv : {
      paddingRight        : 30,
      paddingLeft         : 30,
      flex                : 1,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    formControl : {
      flex                : 1,
      paddingTop          : 20
    },
    icon : {
      color               : '#fff',
      fontSize            : 16
    },
    Register : {
      position            : 'absolute',
      bottom              : 50,
      backgroundColor     : "#121212",
      margin              : 0,
      right               : -30,
      borderBottomRightRadius : 0,
      borderTopRightRadius    : 0,
    },
    icons : {
      position            : "absolute",
      left                : 20,
      color               : "#FFF",
      fontSize            : 18,
      top                 : 14
    },
    item : {
      width               : "100%",
      marginLeft          : 0,
      marginRight         : 0,
      marginTop           : 15,
      padding             : 0,
      borderBottomWidth   : 0,
    },
    label : {
      width               : "95%",
      color               : '#bbb', 
      borderWidth         : 0,
      padding             : 10,
      top                 : 3,
      fontFamily          : 'CairoRegular',
      textAlign           : "left",
      fontSize            : 14,
      // zIndex              : 9,
      backgroundColor     : '#ffffff',
      opacity             : 1,
      paddingTop          : 0,
      paddingBottom       : 0,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    input : {
      borderColor         : '#e9e8e8',
      borderWidth         : 1,
      borderRadius        : 5,
      width               : "100%",
      color               : '#dba261',
      padding             : 5,
      textAlign           : 'right',
    },
    bgLiner:{
      borderRadius        : 5,
      width               : 170,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    touchBtn : {
      backgroundColor     : "#dba261",
      borderRadius        : 10,
      width               : 170,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
      margin              : 40
    },
    textBtn : {
      textAlign           : 'center',
      color               : '#fff',
      fontSize            : 16,
      padding             : 7,
      fontFamily          : 'CairoRegular'
    },
    textFont : {
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
      color               : '#bbb',
      fontSize            : 16,
      fontFamily          : 'CairoRegular'
    }
});


export default ForgetPassword;