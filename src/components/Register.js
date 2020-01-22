import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity,AsyncStorage, KeyboardAvoidingView  } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Icon,Picker,Toast } from 'native-base'

import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import { Permissions, Notifications } from 'expo'

import axios from "axios";
import CONST from "../consts";

import Spinner from 'react-native-loading-spinner-overlay';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
        selected2             : undefined,
        spinner               : false,
        cities                : [],
        countries             : [],
        name                  : '' ,
        phone                 : '',
        password              : '',
        country_id            : 0,
        city_id               : 0,
        token                 : '',
        passwordStatus        : 0,
        verifyPasswordStatus  : 0,
        user_id               : ""
    };
  }

  async componentWillMount() {
    
    I18nManager.forceRTL(true);

    this.setState({spinner :  true});

    axios({
      url       : CONST.url + 'countries',
      method    : 'GET',
    }).then(response => {
      
      this.setState({
        countries     :  response.data.data,
        spinner       :  false 
      });
      
    }).catch(err => { 
      console.log(err);
    });

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
    this.setState({ token })
    AsyncStorage.setItem('deviceID', token);
       
  }

  onValueChange(value) {

    
    this.setState({spinner :  true});

    this.setState({ country_id: value});

    setTimeout(()=>{

          axios({
            url       : CONST.url + 'selectedCities',
            method    : 'POST',
            data      : { country_id: this.state.country_id }
          }).then(response => {
            
            this.setState({
              cities    :  response.data.data,
              spinner   :  false
            });
            
          }).catch(err => { 
            console.log(err);
          });

    },1500);

  }

  onValueChangeCity(value) {
    this.setState({
      city_id: value
    });
  }

  
  validate = () => {
    let isError   = false;
    let msg       = '';
    if (this.state.name.length <= 0) {
      isError     = true;
      msg         = 'إدخال الإسم';
    }else if (this.state.phone.length <= 0) {
        isError   = true;
        msg       = 'إدخال رقم الهاتف';
    }else if (this.state.phone.length !== 10){
      isError   = true;
      msg       = 'رقم الهاتف لا يقل عن 10 أرقام';
    }else if (this.state.country_id <= 0) {
      isError   = true;
      msg       = 'إختر البلد';
    }else if (this.state.city_id <= 0) {
      isError   = true;
      msg       = 'إختر المدينه';
    }else if (this.state.password.length <= 0) {
        isError   = true;
        msg       = 'كلمة السر مطلوبه';
    }else if (this.state.password.length < 6) {
      isError   = true;
      msg       = 'كلمة المرور اقل من 6 احرف';
    }else if (this.state.password !== this.state.verifyPassword) {
        isError   = true;
        msg       = 'كلمة المرور و تأكيد كلمة المرور غير متطابقين';
    }

    if (msg !== ''){
        Toast.show({ 
          text          : msg, 
          duration      : 2000,
          type          : "danger", 
          textStyle     : {  
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center' 
          }
        });
    }
    return isError;
  };

  onRegister(){
    const err = this.validate();

    if (!err){
      this.setState({spinner :  true});
      axios({
        url       : `${CONST.url}auth/register`,
        method    : 'POST',
        data      : { 
          name                      : this.state.name,
          phone                     : this.state.phone,
          country_id                : this.state.country_id ,
          city_id                   : this.state.city_id,
          password                  : this.state.password,
          password_confirmation     : this.state.verifyPassword,
          device_id                 : this.state.token
        }
      }).then(response => {

          this.setState({ spinner: false });

        Toast.show({
          text        : response.data.message,
          type        : response.data.success === true ? "success" : "danger",
          duration    : 3000,
          textStyle   : { 
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center' 
          } 
      });

      if(response.data.success === true){
        this.props.navigation.navigate('activeacount',{ user_id : response.data.data.user.id});
      }
        
      }).catch(err => { 
        console.log(err);
        Toast.show({
            text        : 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
            type        : "danger",
            duration    : 3000,
            textStyle   : {
                color       : "white",
                fontFamily  : 'CairoRegular',
                textAlign   : 'center'
            }
        });
      });
    }
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

        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <KeyboardAvoidingView behavior={'padding'} style={{ flex : 1 }}>
        <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>
        <View style={styles.bgImage}>
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgDiv}>
              <Text style={styles.text}>تسجيل</Text>
              <Form style={styles.formControl}>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>اسم المستخدم</Label>
                  <Input style={styles.input} onChangeText={(name) => this.setState({ name })} auto-capitalization={false}/>
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>رقم الجوال</Label>
                  <Input maxLength={10} style={styles.input} onChangeText={(phone) => this.setState({ phone })} keyboardType={'number-pad'}/>
                </Item>

                <View style={styles.viewPiker}>
                    <Item style={styles.itemPiker} regular>
                        <Picker
                            iosHeader={'البلد'}
                            headerBackButtonText={'رجوع'}
                            mode="dropdown"
                            style={styles.Picker}
                            placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                            selectedValue={this.state.country_id}
                            onValueChange={this.onValueChange.bind(this)}
                            textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                            placeholder="البلد"
                            itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                            
                            {
                                this.state.countries.map((country, i) => (
                                    <Picker.Item key={i} label={country.name} value={country.id} />
                                ))
                            }
                        
                        </Picker>
                    </Item>
                    <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                </View>

                <View style={styles.viewPiker}>
                    <Item style={styles.itemPiker} regular>
                        <Picker
                            iosHeader={'المدينه'}
                            headerBackButtonText={'رجوع'}
                            mode="dropdown"
                            style={styles.Picker}
                            placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                            selectedValue={this.state.city_id}
                            onValueChange={this.onValueChangeCity.bind(this)}
                            textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                            placeholder="المدينه"
                            itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                            {
                                this.state.cities.map((city, i) => (
                                    <Picker.Item key={i} label={city.name} value={city.id} />
                                ))
                            }
                        
                        </Picker>
                    </Item>
                    <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                </View>

                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>كلمة المرور</Label>
                  <Input style={styles.input} onChangeText={(password) => this.setState({ password })} secureTextEntry/>
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>تآكيد كلمه المرور</Label>
                  <Input style={styles.input} onChangeText={(verifyPassword) => this.setState({ verifyPassword })} secureTextEntry/>
                </Item>

                <TouchableOpacity onPress={() => this.onRegister()} style={styles.touchBtn}>
                    <Text style={styles.textBtn}>تسجيل</Text>
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
      top                 : -65,
    },
    bgDiv : {
      paddingRight        : 30,
      paddingLeft         : 30,
      flex                : 1,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
      paddingTop          : 30
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
      width               : "100%",
      color               : '#363636',
      borderWidth         : 0,
      padding             : 10,
      top                 : 2,
      fontFamily          : 'CairoRegular',
      textAlign           : "left",
      fontSize            : 16,
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
      color               : '#363636',
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
    },
    viewPiker : {
      position            : 'relative',
      top                 : 22,
      overflow            : "hidden",
      marginTop           : 10,
      marginBottom        : 10,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    },
    Picker : {
      width               : '100%', 
      writingDirection    : 'rtl',
      borderWidth         : 0,
      paddingLeft         : 0,
      fontSize            : 18,
      fontFamily          : 'CairoRegular',
      backgroundColor     : 'transparent',
      marginRight         : 0,
      borderRadius        : 10,
      height              : 50,
    },
    itemPiker : {
      borderWidth         : 0,
      borderColor         : "#DDD" ,
      width               : '100%',
      position            : 'relative',
      fontSize            : 16,
      fontFamily          : 'CairoRegular',
      borderRadius        : 5,
    },
    iconPicker : {
      position            : 'absolute',
      right               : 5,
      color               : "#bbb",
      fontSize            : 16
    },
});


const mapStateToProps = ({ lang }) => {

  return {

      lang   : lang.lang,

  };
};
export default connect(mapStateToProps,{})(Register);