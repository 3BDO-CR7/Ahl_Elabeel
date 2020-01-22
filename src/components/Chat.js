import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity  } from 'react-native';
import { Container, Content, Icon, Title, Header, Left, Body, Right, Button, Input,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-loading-spinner-overlay';

import Tabs from './Tabs';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
        spinner             : false,
        user_id             : '',
        message             : [],
    };
  }

  async componentDidMount() {
    
    I18nManager.forceRTL(true);

    this.setState({spinner :  true});

    axios({
      url       : CONST.url + 'getAllConvertions',
      method    : 'POST',
      data      : { 
        user_id    :  this.props.auth.data.user.id
      }
    }).then(response => {


      let data = response.data.data.convertions;

      if(data.length === 0){
        Toast.show({ 
          text        : 'لا توجد رسائل', 
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
          message     :  response.data.data.convertions,
        })
      }

      this.setState({spinner : false});
      
    }).catch(err => { 
      console.log(err);
      this.setState({spinner :  false});
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
    drawerLabel : () => null,  
  });

  render() {

    const img       =  
    <View style     = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style  = {{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    return (
      <Container>
  
      <Spinner 
      visible           = { this.state.spinner }   />

        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon style={styles.icons} type="Feather" name='align-right' />
            </Button>
          </Left>
          <Body>
            <Title style={styles.Title}>الدردشه</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {this.props.auth ? this.props.navigation.navigate('notification') : this.props.navigation.navigate('login')}}>
              <Icon style={styles.icons} type="MaterialCommunityIcons" name='bell-outline' />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgImage}>
                <View style={styles.bgDiv}>

                      {
                        this.state.message.map((mess, i) => (
                          <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('chatroom',{other_user : mess.other_id})}>
                                <View style={styles.blockAbout}>
                                    <View style={styles.imgView}>
                                        <Image style={styles.img} source={{ uri: mess.avatar }} resizeMode="contain" />
                                    </View>
                                    <View style={styles.blockText}>
                                        <View style={styles.notyText}>
                                            <Text style={styles.textUser}>{ mess.name }</Text>
                                            <Text style={styles.text}>{ mess.date }</Text>
                                        </View>
                                        <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>
                                            { mess.message }
                                        </Text>
                                    </View>
                                </View>
                              </TouchableOpacity>
                          </Animatable.View>
                        ))
                      }

                </View>
            </View>
        </Content>

        <Tabs routeName="chat"  navigation={this.props.navigation}/>

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
    zIndex              : 99,
    top                 : 40,
    position            : "relative"
  },
  Title : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 20,
  },
  text :{
    color               : "#a1a5ab",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    textAlign           : "left"
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : 52,
  },
  upBlock : {
    minHeight           : 90,
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
    borderBottomWidth   : 1,
    paddingVertical     : 10,
    marginVertical      : 5,
    paddingHorizontal   : 10,
    flexDirection       : "row",
    justifyContent      : "space-between",
  },
  imgView : {
    flexBasis           : "20%",
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  img : {
    width               : 50,
    height              : 50,
    borderColor         : "#DDD",
    borderWidth         : 1,
  },
  blockText : {
    flexBasis           : "80%"
  },
  notyText : {
    flexDirection       : "row",
    justifyContent      : "space-between"
  },
  textUser : {
    color               : "#504b45",
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
export default connect(mapStateToProps, { userLogin ,profile })(Chat);