import React, { Component } from 'react';
import { StyleSheet, View, Text, I18nManager, Image, TouchableOpacity} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button,Switch,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-loading-spinner-overlay';

class Setting extends Component {

  constructor(props) {
    super(props);
    this.state = {
        pageName      : this.props.routeName,
        switchValue   : '',
        spinner       : false,
    };
  }

  componentDidMount() {   
    
    I18nManager.forceRTL(true)

    this.setState({spinner :  true});

    if(this.props.auth)
    {

      axios({
        url       : CONST.url + 'userNotficationStatus',
        method    : 'POST',
        data      : { 
          user_id    :  this.props.auth.data.user.id
        }
      }).then(response => {
  
        if(response.data.data.status === 1){
          this.setState({ switchValue: true });
        }else{
          this.setState({ switchValue: false });
        }
  
        this.setState({spinner : false});
        
      }).catch(err => { 
        console.log(err);
      });

    }else{

        this.props.navigation.navigate('login');

        this.setState({spinner :  false});

        Toast.show({ 
          text : 'يجب عليك التسجيل آولا', 
          duration      : 2000,
          type          : "danger", 
          textStyle       : {  
              color         : "white",
              fontFamily    : 'CairoRegular',
              textAlign     : 'center' 
            } 
        });
        
    }


  }

  toggleSwitch = value => {

    this.setState({spinner :  true});

    axios({
      url       : CONST.url + 'reciveNotificationsStatus',
      method    : 'POST',
      data      : { 
        user_id    :  this.props.auth.data.user.id
      }
    }).then(response => {

      Toast.show({ 
        text        : response.data.message, 
        duration    : 2000,
        type        : "danger", 
        textStyle   : { 
          color       : "white",
          fontFamily  : 'CairoRegular',
          textAlign   :'center' 
        } 
      });

      if(response.data.data.key === 1){
        this.setState({ switchValue: true });
      }else{
        this.setState({ switchValue: false });
      }

      this.setState({spinner : false});
      
    }).catch(err => { 
      console.log(err);
    });

  };


  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>الآعدادات</Text> ),
    drawerIcon  : ( <Icon style={styles.icon} type="AntDesign" name="setting" /> )
  });

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
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>الآعدادات</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 , zIndex : -1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.bgDiv}>
                    <View style={styles.bgBlock}>
                      <View style={styles.Noty}>
                          <Text style={[styles.textInfo , styles.labelInfo]}>الآشعارات</Text>
                          <Text style={styles.textInfo}>{this.state.switchValue ? 'مفتوحه' : 'مغلقه'}</Text>
                          <View>
                              <Switch
                                onValueChange={this.toggleSwitch}
                                value={this.state.switchValue}
                                onTintColor="#dba261"
                                thumbTintColor="#fff"
                                tintColor="#ddd"
                              />
                          </View>
                      </View>
                    </View>
                    <View style={styles.bgBlock}>
                      <TouchableOpacity style={styles.bgTouch} onPress={() => this.props.navigation.navigate('editprofile')}>
                        <View style={styles.Noty}>
                            <Text style={styles.textInfo}>تعديل حسابي</Text>
                            <View><Icon style={styles.iconLabel} type="Entypo" name='chevron-thin-left'/></View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bgTouch} onPress={() => this.props.navigation.navigate('changepassword')}>
                        <View style={styles.Noty}>
                            <Text style={styles.textInfo}>تغيير كلمه المرور</Text>
                            <View><Icon style={styles.iconLabel} type="Entypo" name='chevron-thin-left'/></View>
                        </View>
                      </TouchableOpacity>
                    </View>
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
    height : 90
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
  icon : {
    color               : "#FFF",
    fontSize            : 25,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 22,
  },
  iconLabel : {
    color               : "#a1a5ab",
    fontSize            : 22,
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
  },
  bgBlock : {
    backgroundColor     : "#f5f5f4",
    marginVertical      : 5,
    padding             : 10,
    borderRadius        : 5
  },
  bgTouch : {
    marginVertical      : 5,
  },
  Noty : {
    flexDirection       : 'row',
    justifyContent      : "space-between",
    position            : "relative",
    padding             : 10,
    borderColor         : "#504b45",
    borderWidth         : 1,
    borderRadius        : 5,
    alignItems          : "center"
  },
  labelInfo : {
    position            : "absolute",
    left                : 0,
    top                 : -13,
    backgroundColor     : "#f5f5f4",
    paddingHorizontal   : 5,
    fontSize            : 13
  }
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile })(Setting);