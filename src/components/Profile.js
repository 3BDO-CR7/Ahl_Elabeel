import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, I18nManager} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Left, Right, Button, Item, Input, Label,Toast } from 'native-base'

import Tabs from './Tabs';

import { connect } from 'react-redux';
import { profile } from '../actions'
import { NavigationEvents } from "react-navigation";

import Spinner from 'react-native-loading-spinner-overlay';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spinner               : false,
    };
  }


  onFocus(){
    this.componentWillMount();
  }

  async componentWillMount() {
    
    I18nManager.forceRTL(true)

    if(this.props.auth){

        this.props.profile  ({ 
          user_id  : this.props.auth.data.user.id }
        );

    }else{

        this.props.navigation.navigate('login');

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

  // Navigation Options

  static navigationOptions = () => ({
    drawerLabel : () => null,  
  });

  render() {

    const img       =  
    <View style     = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style  = {{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    const { name, country, city, phone, avatar } = this.props.user;

    return (
      <Container>
        
        <NavigationEvents onWillFocus={() => this.onFocus()} />

        <Spinner 
        visible           = { this.state.spinner }
 />
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon style={styles.icons} type="Feather" name='align-right' />
            </Button>
          </Left>
          <Body>
            <Title style={styles.text}>حسابي</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {this.props.auth ? this.props.navigation.navigate('notification') : this.props.navigation.navigate('login')}}>
              <Icon style={styles.icons} type="MaterialCommunityIcons" name='bell-outline' />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 , zIndex : -1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.blockForm}>
                    <View style={styles.formControl}>

                      <View style={styles.uploadImg}>
                        <View style={styles.imagePicker}>
                          <View style={styles.overLay}></View>
                          <View style={styles.viewImage}>
                              <Image style={styles.imgePrive} source={{ uri : avatar }}/>
                          </View>
                        </View>
                        <Text style={styles.textInfo}>{ name }</Text>
                      </View>
                      
                      <Item floatingLabel style={styles.item}>
                          <Label style={styles.label}>رقم الجوال</Label>
                          <Input style={styles.input} value={ phone } disabled />
                          <Icon style={styles.iconInput} type="MaterialIcons" name="phone-iphone" />
                      </Item>
                      <Item floatingLabel style={styles.item}>
                          <Label style={styles.label}>البلد</Label>
                          <Input style={styles.input} value={ country } disabled />
                          <Icon style={styles.iconInput} type="MaterialCommunityIcons" name="flag-variant" />
                      </Item>
                      <Item floatingLabel style={styles.item}>
                          <Label style={styles.label}>المدينه</Label>
                          <Input style={styles.input} value={ city } disabled />
                          <Icon style={styles.iconInput} type="MaterialCommunityIcons" name="map-marker-outline" />
                      </Item>

                      <TouchableOpacity style={styles.clickFunction} onPress={() => this.props.navigation.navigate('editprofile')}>
                          <Text style={styles.textFun}>تعديل</Text>
                      </TouchableOpacity>

                    </View>
                </View>
            </View>
            
        </Content>

        <Tabs routeName="profile"  navigation={this.props.navigation}/>

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
  textInfo : {
    color               : "#a1a5ab",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
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
    minHeight           : 160,
  },
  bgDiv : {
    paddingRight        : 10,
    paddingLeft         : 10,
  },
  formControl : {
    padding             : 15,
    overflow            : "hidden",
    top                 : -100
  },
  // iconInput : {
  //   position            : "absolute",
  //   top                 : 8,
  //   right               : 10,
  //   color               : '#dba261',
  //   fontSize            : 19,
  //   paddingTop          : 0,
  //   paddingRight        : 0
  // },
  item : {
    width               : "100%",
    marginLeft          : 0,
    marginRight         : 0,
    marginTop           : 25,
    padding             : 0,
    borderBottomWidth   : 0,
    position            : "relative"
  },
  iconInput : {
    position            : "absolute",
    top                 : 20,
    right               : 10,
    color               : '#dba261',
    fontSize            : 19,
    paddingTop          : 0,
    paddingRight        : 0
  },
  label : {
    color               : '#504b45', 
    borderWidth         : 0,
    padding             : 10,
    top                 : 7,
    fontFamily          : 'CairoRegular',
    textAlign           : "left",
    fontSize            : 13,
    zIndex              : 99,
    backgroundColor     : '#ffffff',
    opacity             : 1,
    paddingTop          : 0,
    paddingBottom       : 0,
    alignSelf           : 'flex-start',
  },
  input : {
    borderColor         : '#504b45',
    borderWidth         : 1,
    borderRadius        : 5,
    width               : "100%",
    color               : 'black',
    padding             : 5,
    textAlign           : 'right',
    fontSize            : 13,
    fontFamily          : 'CairoRegular',
    zIndex              : -1
  },
  bgLiner:{
    borderRadius        : 5,
    width               : 170,
    alignItems          : 'center',
    justifyContent      : 'center',
    alignSelf           : 'center',
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
  uploadImg :{
    position            : "relative",
    zIndex              : 999
  },
  imagePicker : {
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    marginVertical        : 20,
    width                 : 160,
    height                : 110,
    borderWidth           : 1,
    borderColor           : "#DDD",
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    position              : "relative",
    zIndex                : 999
  },
  overLay : {
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    width                 : 160,
    height                : 140,
    borderWidth           : 1,
    borderColor           : "#DDD",
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    left                  : -8,
    top                   : -25,
    position              : "absolute",
    zIndex                : -1
  },
  viewImage : {
    width                 : 160,
    height                : 140,
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    padding               : 0,
    overflow              : 'hidden',
    shadowColor           : "transparent",
    shadowOffset          : { width: 0,height: 0 },
    elevation             : 0,
    zIndex                : 999,
    position              : "relative",
  },
  imgePrive : {
    position              : 'absolute', 
    width                 : 160,
    height                : 140,
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    borderRadius          : 5
  },
  clickFunction : {
    backgroundColor     : "#dba261",
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    borderRadius        : 10,
    marginVertical      : 40,
    padding             : 5,
    width               : 120,
  },
  textFun : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
  }
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { profile  })(Profile);