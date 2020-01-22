import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,KeyboardAvoidingView ,I18nManager } from 'react-native';
import { Container, Content, Form, Item, Input, Label,Toast } from 'native-base'

import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
import { userLogin, profile, tempAuth} from '../actions'

import axios from "axios";
import CONST from "../consts";

class NewPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      spinner           : false,
      code              : "",
      password          : "",
      verifyPassword    : "",
      user_id           : this.props.navigation.getParam('user_id'),
    };
  }

  async componentWillMount() {
   
    I18nManager.forceRTL(true)

  }

  sentData(){

    this.setState({spinner  :  true});

    axios({
      url       : `${CONST.url}auth/resetPassword`,
      method    : 'POST',
      data      : {
        code                      : this.state.code,
        password                  : this.state.password,
        password_confirmation     : this.state.verifyPassword,
        user_id                   : this.state.user_id
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
      
      this.setState({spinner  :  false});

      if(response.data.success === true){
        this.props.navigation.navigate('login');
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
              <Text style={styles.text}>ادخال كود التحقق للحصول علي كلمه مرور جديده</Text>
              <Form style={styles.formControl}>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>كود التحقق</Label>
                  <Input style={styles.input} onChangeText={(code) => this.setState({code})} value={ this.state.code } />
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>كلمة المرور الجديده</Label>
                  <Input style={styles.input} onChangeText={(password) => this.setState({password})}  value={ this.state.password } />
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>تآكيد كلمة المرور الجديده</Label>
                  <Input style={styles.input} onChangeText={(verifyPassword) => this.setState({verifyPassword})}  value={ this.state.verifyPassword }/>
                </Item>
                <TouchableOpacity onPress={() => this.sentData()} style={styles.touchBtn}>
                    <Text style={styles.textBtn}>تآكيد</Text>
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
      fontSize            : 22,
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
      fontSize            : 18,
      padding             : 7,
      fontFamily          : 'CairoRegular'
    },
    textFont : {
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
      color               : '#bbb',
      fontSize            : 18,
      fontFamily          : 'CairoRegular'
    }
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile , tempAuth })(NewPassword);