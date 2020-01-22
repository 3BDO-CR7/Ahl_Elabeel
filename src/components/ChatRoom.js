import React, { Component } from 'react';
import { StyleSheet, Text, Image, View,ScrollView, I18nManager } from 'react-native';
import  { Container, Content, Button, Icon, Input, Title, Header, Body,Toast} from 'native-base';

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-loading-spinner-overlay';

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner             : false,
            other_id            : this.props.navigation.getParam('other_id'),
            message             : '',
            convertions         : [],
            massage_user        : 1
        };
    }

    componentDidMount() {
    
        I18nManager.forceRTL(true)




        this.setState({spinner :  true});
        this.setState({other_id :   this.props.navigation.getParam('other_id')});

        axios({
          url       : CONST.url + 'getSingleConvertion',
          method    : 'POST',
          data      : { 
            user_id         : this.props.auth.data.user.id,
              other_user      : this.props.navigation.state.params.other_user,
          }
        }).then(response => {

            this.setState({
                convertions  :  response.data.data.convertions,
            })
    
            this.setState({spinner : false});
          
        }).catch(err => { 
            console.log(err);
            this.setState({spinner : false});
        }).then(()=>{
            this.setState({spinner : false});
        });
    
    }

    sentMessage(){

        this.setState({spinner :  true});
    
        axios({
          url       : CONST.url + 'AddMessage',
          method    : 'POST',
          data      : { 
            user_id         : this.props.auth.data.user.id,
            other_user      : this.props.navigation.state.params.other_user,
            message         : this.state.message
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

            this.setState({
                convertions  :  response.data.data,
            });

            this.setState({message : ''})
    
            this.setState({spinner : false});
          
        }).catch(err => {
            console.log(err.message);
            this.setState({spinner : false});
        }).then(()=>{
            this.setState({spinner : false});
        });

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
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>الدردشه</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <View style={styles.upBlock}></View>
        <View style={styles.bgImage}>
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgDiv}>

            <ScrollView style={{height : 600, width : '100%'}} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{ this.scrollView.scrollToEnd({animated: true})}}>

                    {
                        (this.state.convertions.length > 0) ?
                        this.state.convertions.map((chat, i) => {
                            return (

                                (this.state.massage_user === chat.belongs_to_user)
                                    ?
                                <Animatable.View animation="fadeInRight" easing="ease-out" delay={1000}>
                                <View key={i} style={styles.chat}>
                                    <View style={[styles.textContent , styles.chatSent]}>
                                        <Text style={styles.text}>
                                            {chat.message}
                                        </Text>
                                        <Text style={[styles.time , styles.timeLight]}>{chat.date}</Text>
                                    </View>
                                </View>
                                </Animatable.View>

                                    :
                                <Animatable.View animation="fadeInLeft" easing="ease-out" delay={1000}>
                                <View key={i} style={styles.chat}>
                                    <View style={styles.image}>
                                        <Image style={styles.imgUser} source={{uri : chat.avatar}} resizeMode="contain"/>
                                    </View>
                                    <View style={[styles.textContent , styles.chatReceived]}>
                                        <Text style={[ styles.text , styles.info ]}>
                                            {chat.message}
                                        </Text>
                                        <Text style={[styles.time , styles.timeDark]}>{chat.date}</Text>
                                    </View>
                                </View>
                                </Animatable.View>
                            )
                        })
                            : <View></View>
                    }       
            
            </ScrollView>
            
            </View>
        </View>
        </Content>

        <View style={styles.writeMassage}>
            <Input style={styles.input_search} onChangeText={(message) => this.setState({ message })} auto-capitalization={false} placeholder="اكتب رسالتك"/>
            <Button transparent style={styles.btn_massage} onPress={() => this.sentMessage()}>
                <Icon style={styles.icon_massage} type="Entypo" name='paper-plane' />
            </Button>
        </View>

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
        zIndex              : 99,
        position            : "relative",
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
    text : {
        color               : "#fff",
        fontFamily          : "CairoRegular",
        fontSize            : 13
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
        top                 : -120,
    },
    icon : {
        color               : "#bbb",
        fontSize            : 18,
        position            : "relative",
    },
    icons : {
        color               : "#FFF",
        fontSize            : 25,
    },
    content : {
        paddingTop           : 10,
        paddingBottom        : 100,
        marginBottom         : 75,
    },
    Btn : {
      borderRadius           : 100,
      width                  : 35,
      height                 : 35,
      textAlign              : 'center',
      backgroundColor        : "#fff",
      paddingTop             : 2,
    },
    Btn_Icon : {
      color                  : "#68d9fa",
      fontSize               : 30,
      textAlign              : 'center'
    },
    chat : {
        marginVertical       : 5,
        textAlign            : 'center',
        alignItems           : 'center',
        justifyContent       : 'center',
    },
    textContent : {
        padding              : 5,
        width                : '80%',
        paddingLeft          : 25, 
        paddingRight         : 25,
        textAlign            : 'center',
        alignItems           : 'center',
        justifyContent       : 'center',
        borderRadius         : 30,
        marginVertical       : 5 
    },
    chatSent : {
        backgroundColor      : "rgba(80, 75, 69, 0.7)",
        borderBottomLeftRadius  : 0,
    },
    chatReceived : {
        backgroundColor      : "rgba(219, 162, 97, 0.7)",
        borderTopRightRadius     : 0,
    },
    time : {
        fontFamily           : "CairoRegular",
        fontSize             : 13,
        alignSelf            : "flex-end"
    },
    info : {
        color                : "#504b45",
    },
    timeLight : {
        color                : "#fff",
    },
    timeDark : {
        color                : "#504b45",
    },
    image : {
        position             : 'absolute',
        right                : -8,
        top                  : 5,
        zIndex               : 99 
    },
    imgUser : {
        width                : 40,
        height               : 40,
    },
    writeMassage : {
        position             : 'absolute',
        bottom               : 0,
        width                : '100%',
        right                : 0,
        backgroundColor      : '#FFF',
        flexDirection        : "row",
        justifyContent       : 'space-between',
        padding              : 5,
        alignItems           : "center"
    },
    input_search : {
        borderWidth          : 1,
        borderColor          : '#DDD',
        textAlign            : 'right',
        borderRadius         : 10,
        paddingRight         : 10,
        paddingLeft          : 10,
        flexBasis            : "85%",
        backgroundColor      : "#DDD",
        fontFamily           : "CairoRegular",
        color                : "#504b45",
        fontSize             : 14
    },
    btn_massage : {
        flexBasis            : "15%"
    },
    icon_massage : {
        width                : 40,
        height               : 40,
        lineHeight           : 40,
        borderRadius         : 100,
        backgroundColor      : "#504b45",
        color                : "#fff",
        alignItems           : 'center',
        justifyContent       : 'center', 
        alignSelf            : 'center',
        textAlign            : "center",
        marginRight          : 0,
        marginLeft           : 10
    }
});

const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user,
    };
};
export default connect(mapStateToProps, { userLogin ,profile })(ChatRoom);