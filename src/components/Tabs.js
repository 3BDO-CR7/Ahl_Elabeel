import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, I18nManager} from 'react-native';
import  {Icon, Footer, FooterTab, Button, Text, View, Toast} from 'native-base';

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { profile } from '../actions'
import { NavigationEvents } from "react-navigation";

import Modal from "react-native-modal";

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageName        : this.props.routeName,
            termsAds        : '',
        };
    }

    state = {
        isModalVisible      : false,
    };

    toggleModal = () => {

        if(!this.props.auth){
      
            this.setState({spinner :  false});
        
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
    
        }else{

            this.setState({ isModalVisible: !this.state.isModalVisible });

        }

    };

    componentDidMount() {
    
        I18nManager.forceRTL(true);

        axios({
          url       : CONST.url + 'adevrtisemetTerms',
          method    : 'GET',
      }).then(response => {
         
        this.setState({
          termsAds        :  response.data.data
        });
         
      }).catch(err => { 
        console.log(err);
      });
    
    }

    chickUser(page){

        if(!this.props.auth){
      
            this.setState({spinner :  false});
        
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
    
        }else{

            this.props.navigation.navigate(page, { id: null });

        }

    }
    

  render() {

    return (
      <Footer>
          <FooterTab style={styles.footer_Tab}>
            <Button onPress={() => this.chickUser('home')} 
                style={{
                    borderTopWidth   : this.state.pageName === 'home'? 2 : 0,
                    borderTopColor   : this.state.pageName === 'home'? '#4c4640' : '#4c4640',
                }}>
                <Icon style={{
                    color            : this.state.pageName === 'home'? '#4c4640' : '#cfd0d4',
                }} 
                type="SimpleLineIcons" name="home" />
            </Button>
            <Button onPress={() => this.chickUser('adv')}
                style={{
                    borderTopWidth   : this.state.pageName === 'adv'? 2 : 0,
                    borderTopColor   : this.state.pageName === 'adv'? '#4c4640' : '#4c4640',
                }}>
                <Icon style={{
                    color   : this.state.pageName === 'adv'? '#4c4640' : '#cfd0d4',
                    top     : this.state.pageName === 'adv'? -5 : 0,
                }} 
                type="Foundation" name='thumbnails' />
            </Button>
            <Button onPress={this.toggleModal}>
                <View style={styles.plus}>
                    <Icon style={{color : '#fff'}} type="AntDesign" name='plus' />
                </View>
            </Button>
            <Button onPress={() => this.chickUser('profile')}
                style={{
                    borderTopWidth   : this.state.pageName === 'profile'? 2 : 0,
                    borderTopColor   : this.state.pageName === 'profile'? '#4c4640' : '#4c4640',
                }}>
                <Icon style={{
                    color   : this.state.pageName === 'profile'? '#4c4640' : '#cfd0d4',
                    top     : this.state.pageName === 'profile'? -5 : 0,
                }} 
                type="FontAwesome" name='user-o' />
            </Button>
            <Button onPress={() => this.chickUser('chat')}
                style={{
                    borderTopWidth   : this.state.pageName === 'chat'? 2 : 0,
                    borderTopColor   : this.state.pageName === 'chat'? '#4c4640' : '#4c4640',
                }}>
                <Icon style={{
                    color   : this.state.pageName === 'chat'? '#4c4640' : '#cfd0d4',
                    top     : this.state.pageName === 'chat'? -5 : 0,
                }} 
                type="Feather" name='message-square' />
            </Button>
          </FooterTab>

            <Modal 
            isVisible={this.state.isModalVisible} 
            style={styles.bgModel}
            hasBackdrop={false}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}
            // onSwipe={this.modalComment}
            swipeDirection="bottom"
            >
                <View style={styles.contentModel}>
                <Image style={[styles.curve , styles.curveModel]} source={require('../../assets/brown_curve.png')}/>
                    <View style={styles.model}>
                        <Text style={styles.Title}>
                            شروط آضافه الآعلان
                        </Text>
                        <Text style={styles.text}>{ this.state.termsAds }</Text>
                        <View style={styles.blockContent}>
                            <TouchableOpacity style={styles.clickFunction} onPress={() => [this.props.navigation.navigate('forme3lan') , this.toggleModal() ]}>
                                <Text style={styles.textFun}>تآكيد</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.clickFunction} onPress={this.toggleModal}>
                                <Text style={styles.textFun}>رفض</Text>
                            </TouchableOpacity>
                        </View>         
                    </View>
                </View>
            </Modal>

        </Footer>
    );
  }
}

const styles = StyleSheet.create({
    footer_Tab : {
        backgroundColor     : "#FFF",
        shadowColor         : '#ddd',
        shadowOffset        : { width: 0 , height : -3 },
        shadowOpacity       : 0.4,
        elevation           : 5,
        borderBottomColor   : '#bbb',
    },
    btn_Footer : {
        borderRadius        : 0
    },
    plus : {
        backgroundColor     : "#4c4640",
        width               : 50,
        height              : 50,
        borderRadius        : 150,
        alignItems          : 'center', 
        justifyContent      : 'center', 
        alignSelf           : 'center',
        position            : "relative",
        top                 : -25,
    },
    Title :{
        color               : "#fff",
        fontFamily          : "CairoRegular",
        fontSize            : 22,
        marginBottom        : 15,
        alignItems          : 'center', 
        justifyContent      : 'center', 
        alignSelf           : 'center',
    },
    text : {
        color               : "#f2f2f2",
        fontFamily          : "CairoRegular",
        fontSize            : 14,
        paddingHorizontal   : 10,
        marginBottom        : 15,
        alignItems          : 'center', 
        justifyContent      : 'center', 
        alignSelf           : 'center',
        textAlign           : "center"
    },
    contentModel : {
        alignItems          : 'center',
        justifyContent      : 'center', 
        alignSelf           : 'center',
        width               : "111%",
        backgroundColor     : "#615c56e8",
        flex                : 1,
        top                 : 175
    },
    model : {
        width               : "100%",
        top                 : -110,
    },
    curveModel : {
        opacity             : 0.9,
        top                 : -79,
        width               : '100%',
        height              : 80,
        zIndex              : -1,
        position            : 'absolute',
    },
    clickFunction : {
        backgroundColor     : "#dba261",
        alignItems          : 'center',
        justifyContent      : 'center', 
        alignSelf           : 'center',
        borderRadius        : 10,
        margin              : 10,
        padding             : 5,
        width               : 120,
    },
      textFun : {
        color               : "#fff",
        fontFamily          : "CairoRegular",
        fontSize            : 16,
    },
    blockContent : {
        flexDirection       : "row",
        justifyContent      : "space-around"
    }
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { profile  })(Tabs);