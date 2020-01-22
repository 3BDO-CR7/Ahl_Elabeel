import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,KeyboardAvoidingView, I18nManager  } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Icon, Title, Header, Body, Button,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'

import Spinner from 'react-native-loading-spinner-overlay';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner                         : false,
            user_id                         : '',
            old_password                    : "",
            new_password                    : "",
            confirmation_password           : ""
        };
      }
    
    componentWillMount() {
    
        I18nManager.forceRTL(true)
        
    }

    validate = () => {
        let isError   = false;
        let msg       = '';
        
        if (this.state.old_password.length <= 0) {
            isError   = true;
            msg       = 'كلمة السر مطلوبه';
        }else if (this.state.new_password.length < 6) {
            isError   = true;
            msg       = 'كلمة المرور اقل من 6 احرف';
        }else if (this.state.new_password != this.state.confirmation_password) {
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

    
onSave(){

    this.setState({spinner :  true});

    const err = this.validate();

    if (!err){

      axios({
        url       : `${CONST.url}auth/updatePassword`,
        method    : 'POST',
        data      : {
            user_id                     : this.props.auth.data.user.id, 
            old_password                : this.state.old_password, 
            password                    : this.state.new_password,
            password_confirmation       : this.state.confirmation_password,
        }
      }).then(response => {

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
        this.props.navigation.navigate('setting');
      }
      
      this.setState({spinner     :  false});
        
      }).catch(err => { 
        console.log(err);
        this.setState({ spinner: false });
        Toast.show({
            text        : 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
            type        : "danger",
            duration    : 3000
        });
      });

        const err = this.validate();
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
        <Header style={styles.header}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon style={styles.icon} type="Entypo" name='chevron-thin-right' />
        </Button>
        <Body style={styles.bodyText}>
            <Title style={styles.Title}>تغيير كلمه المرور</Title>
        </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <KeyboardAvoidingView behavior={'padding'}>
        <View style={styles.upBlock}></View>   
        <View style={styles.bgImage}>
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgDiv}>
              <Form style={styles.formControl}>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>كلمة المرور القديمه</Label>
                  <Input style={styles.input} onChangeText={(old_password) => this.setState({ old_password })} secureTextEntry/>
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>كلمة المرور الجديده</Label>
                  <Input style={styles.input} onChangeText={(new_password) => this.setState({ new_password })} auto-capitalization={false}/>
                </Item>
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.label}>تآكيد كلمة المرور الجديده</Label>
                  <Input style={styles.input} onChangeText={(confirmation_password) => this.setState({ confirmation_password })} auto-capitalization={false}/>
                </Item>
                <TouchableOpacity onPress={() => this.onSave()} style={styles.touchBtn}>
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
    header:{
        backgroundColor     : "#dba261",
        borderBottomColor   : "#dba261",
        paddingRight        : 0,
        paddingLeft         : 0,
        paddingTop          : 30,
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
        zIndex              : 99
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
    // icon : {
    //     color               : "#a1a5ab",
    //     fontSize            : 20,
    // },
    text :{
        color               : "#a1a5ab",
        fontFamily          : "CairoRegular",
        fontSize            : 16,
        paddingHorizontal   : 10,
        marginBottom        : 15
    },
    textInfo : {
        color               : "#a1a5ab",
        fontFamily          : "CairoRegular",
        fontSize            : 16,
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
        flex                : 1,
        flexGrow            : 1
    },
    formControl : {
        flex                : 1,
        paddingTop          : 20,
        flexGrow            : 1
    },
    icon : {
        color               : '#fff',
        fontSize            : 23
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
        top                 : 0,
        fontFamily          : 'CairoRegular',
        textAlign           : "left",
        fontSize            : 14,
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
export default connect(mapStateToProps, { userLogin ,profile })(ChangePassword);