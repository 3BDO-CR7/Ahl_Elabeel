import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, I18nManager  } from 'react-native';
import { Container, Content, Icon, Title, Header, Left, Body, Right, Button,Toast } from 'native-base';

import axios from "axios";
import CONST from "../consts";

import Spinner from 'react-native-loading-spinner-overlay';

import Tabs from './Tabs';
import Swiper from 'react-native-swiper';

import {NavigationEvents} from "react-navigation";

import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { userLogin, profile } from '../actions';
import { Notifications } from 'expo';

class Home extends Component {
  
  // Constructor
    
  constructor(props){
    super(props);
    this.state = {
      spinner       : false,
      slider        : [],
      Categories    : [],
    };
  }

  // Navigation Options

  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>الرئيسيه</Text> ) ,
    drawerIcon  : ( <Icon style={styles.icon} type="SimpleLineIcons" name="home" /> )
  });

  handleNotification = (notification) => {
    console.log('test notification', notification);

    if (notification && notification.origin !== 'received') {
      this.props.navigation.navigate('Notification');
    }

  };

  // Component Did Mount
   
   componentDidMount() {

     Notifications.addListener(this.handleNotification);
    
    I18nManager.forceRTL(true);
 
    this.setState({spinner     :  true});

    axios({
      url       : CONST.url + 'home',
      method    : 'GET',
  }).then(response => {
     
    this.setState({
      slider        :  response.data.data.paidAdvertisements,
      Categories    :  response.data.data.categories,
      spinner       :  false
    });

     
  }).catch(err => {
    console.log(err);
    this.setState({spinner : false});
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

  onFocus(){

    this.componentDidMount();
  }

  // Component Render

  render() {         
    
    const img  =  
    <View style = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style={{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    return (
      <Container>
        
      <NavigationEvents onWillFocus={() => this.onFocus()} />

        <Spinner 
        visible           = { this.state.spinner }
   />
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => { this.props.navigation.openDrawer()} }>
              <Icon style={styles.icons} type="Feather" name='align-right' />
            </Button>
          </Left>
          <Body>
            <Title style={styles.text}>الرئيسيه</Title>
          </Body>
          <Right>

            <Button transparent onPress={() => {this.props.auth ? this.props.navigation.navigate('notification') : this.props.navigation.navigate('login')}}>
              <Icon style={styles.icons} type="MaterialCommunityIcons" name='bell-outline' />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <View style={styles.upBlock}>

          {/* <View style={styles.block_search}>
            <Icon style={styles.icon_search} name="ios-search" />
            <Input style={styles.input_search} 
              placeholder           = "بحث" 
              placeholderTextColor  = "#fff" 
              underlineColorAndroid = 'transparent'/>
          </View> */}

        </View>
        <View style={styles.bgImage}>
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgDiv}>
                <View style={styles.block_slider}>
                    <Swiper 
                    containerStyle  = {styles.wrapper} 
                    autoplay        = {true}
                    paginationStyle = {{ justifyContent : "flex-end", paddingHorizontal : 30 }}
                    dotStyle        = {{ backgroundColor: '#fff' }}
                    activeDotStyle  = {{ backgroundColor: '#4c4640', width: 20}}
                    animated        = {true}
                    loop            = {true}
                    autoplayTimeout = { 2 }
                    >
                      {
                            this.state.slider.map((slide, i) => (
                              <TouchableOpacity style={styles.slide} key={i}>
                                  <Image style={styles.slide} source={{ uri: slide.image }} resizeMode={'cover'}/>
                                      <View style={styles.blockInfo}>
                                          <Text style={styles.title} numberOfLines = { 1 } prop with ellipsizeMode = "head"> { slide.name } </Text>
                                          <Text style={styles.info} numberOfLines = { 1 } prop with ellipsizeMode = "head"> { slide.description } </Text>
                                      </View>
                              </TouchableOpacity>
                            ))
                        }
                    </Swiper>
                </View>
                <View style={styles.section}>
                        {
                            this.state.Categories.map((Cate, i) => (
                                   <TouchableOpacity style={styles.block_item} onPress={() => {   this.props.navigation.navigate(
                                    {
                                        routeName: 'adv',
                                        params: {
                                          id: Cate.id,
                                        },
                                        key: 'APage' + i
                                    }
                                    )   }}>
                                        <View style={[styles.block_img, { backgroundColor: Cate.color }]}>
                                            <Image style={styles.Img} source={{ uri: Cate.image }}/>
                                        </View>
                                        <Text style={styles.text_up}>{ Cate.name }</Text>
                                  </TouchableOpacity>
                            ))
                        }
                </View>
            </View>
        </View>
        </Content>

        <Tabs routeName="home"  navigation={this.props.navigation}/>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor     : "#dba261",
    borderBottomColor   : "#dba261",
    paddingTop          : 10,
    height : 90
  },
  contentView : {
    backgroundColor     : '#dba261',
  },
  bgImage : {
    flex                : 1,
    backgroundColor     : '#fff',
  },
  text : {
    color               : "#fff",
    position            : "relative",
    zIndex              : 99,
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 22
  },
  textLabel : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 18,
    marginVertical      : 8
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : -80,
  },
  upBlock : {
    minHeight           : 130,
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
  block_search :{
    position            : 'relative',
    padding             : 10,
    marginTop           : 15,
    width               : '80%',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  },
  icon_search : {
    position            : 'absolute',
    right               : 25,
    top                 : 18,
    color               : '#fff',
    fontSize            : 24,
    zIndex              : 99
  },
  input_search : {
    borderWidth         : 1,
    borderColor         : '#fff',
    borderRadius        : 50,
    textAlign           : 'right',
    fontFamily          : 'CairoRegular',
    paddingLeft         : 20,
    backgroundColor     : "rgba(255, 255, 255, 0.5)",
    height              : 40,
    color               : "#fff"
  },
  block_slider : {
    width               : '95%',
    margin              : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    position            : 'absolute',
    top                 : -90,
    zIndex              : 9,
    borderBottomLeftRadius  : 40,
    borderTopRightRadius    : 40,
  },
  wrapper : {
    height              : 170,
    width               : '100%',
    borderBottomLeftRadius  : 40,
    borderTopRightRadius    : 40,
    overflow            : "hidden"
  },
  slide : {
    width               : "100%",
    height              : 150,
    borderBottomLeftRadius  : 40,
    borderTopRightRadius    : 40,
  },
  Btn : {
    borderRadius        : 100,
    width               : 35,
    height              : 35,
    textAlign           : 'center',
    backgroundColor     : "#fff",
    paddingTop          : 2,
  },
  Btn_Icon : {
    color               : "#68d9fa",
    fontSize            : 30,
    textAlign           : 'center'
  },
  blockInfo : {
    position            : 'absolute',
    left                : 10,
    bottom              : -15,
    zIndex              : 9,
    backgroundColor     : "rgba(0, 0, 0, 0.7)",
    width               : 150,
    borderBottomLeftRadius  : 40,
    borderTopRightRadius    : 40,
    padding             : 10, 
  },
  title : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 16,
    
  },
  info : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 12,
  },
  section : {
    flexDirection       : "row",
    flexWrap            : "wrap",
    marginTop           : 80
  },
  block_item : {
    flexBasis           : "50%",
    padding             : 5,
    marginVertical      : 2,
  },
  block_img : {
    borderRadius        : 10,
    height              : 120,
    width               : "100%",
    padding             : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  },
  colorPink : {
    backgroundColor     : "#d47899",
  },
  colorGreen : {
    backgroundColor     : "#67b9ab",
  },
  colorBlue : {
    backgroundColor     : "#90adf9",
  },
  colorYellow : {
    backgroundColor     : "#f6cf82",
  },
  Img : {
    // transform           : [{ scale: 0.7 }],
    width               : 70,
    height              : 70,
    resizeMode          : "contain"
  },
  text_up : {
    color               : "#121212",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 14,
  }
  
});

const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile  })(Home);