import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, AsyncStorage,KeyboardAvoidingView,I18nManager } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Icon,Toast } from 'native-base'

import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import { Permissions, Notifications } from 'expo'
import { NavigationEvents } from "react-navigation";

import Spinner from 'react-native-loading-spinner-overlay';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
        phone       : '',
        password    : '',
        token       : '',
        spinner     : false,
        userId      : null,
    };
  }

  validate = () => {
    let isError = false;
    let msg = '';

    if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
        isError   = true;
        msg       = 'رقم الهاتف غير صحيح';
    }else if (this.state.password.length <= 0) {
        isError   = true;
        msg       = 'كلمة السر مطلوبه';
    }
    if (msg != ''){
        Toast.show({
            text      : msg,
            type      : "danger",
            duration  : 3000,
            textStyle   : { 
              color       : "white",
              fontFamily  : 'CairoRegular',
              textAlign   : 'center' 
            } 
        });
    }
    return isError;
  };

  onLoginPressed() {

    this.setState({ spinner: true });

    const err = this.validate();

    if (!err){
        this.setState({ spinner: false });
        const {phone, password, token} = this.state;
        this.props.userLogin({ phone, password, token });
    }else{
        this.setState({ spinner: false });
    }

  }

  async componentWillMount() {
    
    I18nManager.forceRTL(true)

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

   let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token, userId: null });
    AsyncStorage.setItem('deviceID', token);

  }

  componentWillReceiveProps(newProps){
    this.setState({ spinner: false });
    console.log('fuck newAuth', newProps.auth);
    if (newProps.auth !== null && newProps.auth.success == true){

      if (this.state.userId === null){
          this.setState({ userId: newProps.auth.data.user.id });
          this.props.profile(newProps.auth.data.user.id);
      }

      this.props.navigation.navigate('DrawerNavigator');
    }

    if (newProps.auth !== null) {
        Toast.show({
            text: newProps.auth.message,
            type: newProps.auth.success ? "success" : "danger",
            duration: 3000,
            textStyle   : { 
              color       : "white",
              fontFamily  : 'CairoRegular',
              textAlign   : 'center' 
            }
        });
    }

  }

  onFocus(){
    this.componentWillMount()
  }

  render() {
    
    const img       =  
    <View style     = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style  = {{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    return (
      <Container>

        <Spinner
            visible           = { this.state.spinner }
        />
        <NavigationEvents onWillFocus={() => this.onFocus()} />

        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <KeyboardAvoidingView behavior={'padding'} style={{ flex : 1 }}>
            <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.bgDiv}>
                  <Text style={styles.text}>تسجيل دخول</Text>
                  <Form style={styles.formControl}>
                    <Item floatingLabel style={styles.item}>
                      <Label style={styles.label}>رقم الجوال</Label>
                      <Input style={styles.input}  keyboardType={'number-pad'} placeholderTextColor="#bbb" onChangeText={(phone) => this.setState({phone})}  value={ this.state.mobile }/>
                    </Item>
                    <Item floatingLabel style={styles.item}>
                      <Label style={styles.label}>كلمة المرور</Label>
                      <Input autoCapitalize='none' value={ this.state.password } onChangeText={(password) => this.setState({password})} secureTextEntry style={styles.input}/>
                    </Item>

                    <TouchableOpacity onPress={() => this.onLoginPressed()} style={styles.touchBtn}>
                        <Text style={styles.textBtn}>دخول</Text>
                    </TouchableOpacity>

                    <Text onPress={() => this.props.navigation.navigate('forgetpassword')} style={styles.textFont}>نسيت كلمة السر ؟</Text>
                  </Form>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('register')} style={styles.Register}>
                      <Icon style={styles.icons} type="AntDesign" name='arrowright' />
                      <Text style={styles.textBtn}>
                        تسجيل
                      </Text>
                  </TouchableOpacity>
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
      fontSize            : 20
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
      flex                : 1,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    formControl : {
      paddingRight        : 30,
      paddingLeft         : 30,
      flex                : 1,
      paddingTop          : 20,
    },
    icon : {
      color               : '#fff',
      fontSize            : 16
    },
    icons : {
      position            : "absolute",
      left                : 20,
      color               : "#FFF",
      fontSize            : 18,
      top                 : 12
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
      color               : '#363636', 
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
    Register : {
      position            : 'relative',
      bottom              : 10,
      backgroundColor     : "#121212",
      margin              : 0,
      borderBottomRightRadius : 0,
      borderTopRightRadius    : 0,
      borderRadius        : 10,
      width               : 160,
      alignSelf           : 'flex-end',
      marginVertical      : 30
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



const mapStateToProps = ({ auth, profile }) => {
  return {
      loading   : auth.loading,
      auth      : auth.user,
      user      : profile.user,
  };
};
export default connect(mapStateToProps, { userLogin, profile })(Login);