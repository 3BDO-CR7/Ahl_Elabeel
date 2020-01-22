import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity ,I18nManager } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-loading-spinner-overlay';

class Notification extends Component {

  constructor(props) {
    super(props);
    this.state = {
        spinner             : false,
        user_id             : '',
        notification_id     : '',
        notifications       : [],
    };
  }

  async componentDidMount() {
    
    I18nManager.forceRTL(true)

    this.setState({spinner :  true});

      
      axios({
        url       : CONST.url + 'Notifications',
        method    : 'POST',
        data      : { 
          user_id    :  this.props.auth.data.user.id
        }
      }).then(response => {
  
        if(response.data.data === undefined || response.data.data.length <= 0){
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
        }else{
          this.setState({
            notifications : response.data.data,
          });
        }
  
        this.setState({spinner : false});
        
      }).catch(err => { 
        console.log(err);
        Toast.show({ 
          text        : 'حدث خطآ ما .. يرجي المحاوله مره آخري', 
          duration    : 2000,
          type        : "danger", 
          textStyle   : { 
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center' 
          } 
        });
        this.setState({spinner : false});
      });

  }

  goShow(status,id){

    if(status === 1){
      this.props.navigation.navigate('chatroom', {
        other_id    : id,
      });
    }else if(status === 0){
      this.props.navigation.navigate('detailsadv', {
        id          : id,
      });
    }

  }

  Delete_Notification(id,i){

    this.setState({spinner :  true});
    
    axios({
      url       : CONST.url + 'DeleteNotification',
      method    : 'POST',
      data      : { 
        user_id             : this.props.auth.data.user.id,
        notification_id     : id,
      }
    }).then(response => {
      
      this.state.notifications.splice(i,1);

      this.setState({spinner : false});

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

    }).catch(err => { 
      console.log(err);
      Toast.show({ 
        text        : 'حدث خطآ ما .. يرجي المحاوله مره آخري', 
        duration    : 2000,
        type        : "danger", 
        textStyle   : { 
          color       : "white",
          fontFamily  : 'CairoRegular',
          textAlign   : 'center' 
        } 
      });
    });

  }

  static navigationOptions = () => ({
    header: null,
    drawerLabel: 'الآشعارات' ,
    drawerIcon: ( <Icon style={styles.icon} type="SimpleLineIcons" name="home" /> )
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
            <Title style={styles.Title}>الآشعارات</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgImage}>

                {
                  this.state.notifications.map((noty, i) => (
                    <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>

                        <View style={styles.blockAbout}>
                            <TouchableOpacity transparent style={styles.clear} onPress={()=>{this.Delete_Notification(noty.notification_id,i)}}>
                                <Icon style={styles.iconClear} type="FontAwesome" name="trash-o" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.goShow(noty.status,noty.ads_or_message_id)}}>
                                <View style={styles.notyText}>
                                    <Text style={styles.textUser}>{ noty.name }</Text>
                                    <Text style={styles.text}>{ noty.time }</Text>
                                </View>
                                <Text style={styles.text_mass} numberOfLines={1} ellipsizeMode='tail'>
                                      { noty.notification_message }
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </Animatable.View>
                  ))
                }

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
  text_mass : {
    color               : "#a1a5ab",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    textAlign           : "left"
  },
  text :{
    color               : "#a1a5ab",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 16,
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : 40,
  },
  upBlock : {
    minHeight           : 120,
  },
  bgDiv : {
    paddingRight        : 10,
    paddingLeft         : 10,
  },
  icon : {
    color               : "#FFF",
    fontSize            : 25,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 25,
  },
  blockAbout : {
    borderColor         : "#DDD",
    borderWidth         : 1,
    paddingVertical     : 10,
    margin              : 10,
    paddingHorizontal   : 10,
    borderRadius        : 10,
    position            : 'relative'
  },
  notyText : {
    flexDirection       : "row",
    justifyContent      : "space-between"
  },
  textUser : {
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
  },
  clear : {
    position            : 'absolute',
    top                 : -10,
    right               : -10,
    margin              : 0,
    paddingBottom       : 0,
    paddingTop          : 0,
    height              : 25,
    width               : 25,
    backgroundColor     : "#504b45",
    borderRadius        : 50,
    alignItems          : "center",
    justifyContent      : "center",
    textAlign           : "center"
  },
  iconClear : {
    color               : "#dba261",
    fontSize            : 15
  }
  
});

const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile })(Notification);