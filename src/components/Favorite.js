import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";
import { Video } from 'expo-av'

import { connect } from 'react-redux';
import { profile } from '../actions'

import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";

import Spinner from 'react-native-loading-spinner-overlay';

class Favorite extends Component {

  constructor(props) {
    super(props);
    this.state = {
        blocks             : [],
        is_favourite       : false,
        spinner            : false,
    };
  }

  async componentWillMount() {
    
    I18nManager.forceRTL(true);

      this.setState({spinner :  true});

        axios({
          url       : CONST.url + 'userFavoriteAdvertisement',
          method    : 'POST',
          data      : { 
            user_id    :  this.props.auth.data.user.id
          }
        }).then(response => {

          let data = response.data.data

          if(data.length === 0 || data === undefined){
            Toast.show({ text:'لا يوجد إعلانات في المفضله', 
            duration    : 2000  ,
            type        :"danger", 
            textStyle     : { 
                color       : "white",
                fontFamily  : 'CairoRegular',
                textAlign   : 'center' 
              } 
            });
          }else{
            this.setState({
              blocks     :  response.data.data,
            })
          }

          this.setState({spinner : false});
        
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

  Delet_favorite(id,i){

    this.setState({spinner :  true});

    axios({
      url       : CONST.url + 'deleteFromFavorite',
      method    : 'POST',
      data      : { 
        advertisement_id    : id,
        user_id             : this.props.auth.data.user.id,
      }
    }).then(response => {

      this.state.blocks.splice(i,1)

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
  
  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>مفضلتي</Text> ) ,
    drawerIcon  : ( <Icon style={styles.icon} type="AntDesign" name="hearto" /> )
  });

  onFocus(){
    this.componentWillMount();
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
        <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>المفضله</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <View style={styles.upBlock}></View>
        <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
        <View style={styles.bgImage}>
            <View style={styles.bgDiv}>

                <View style={styles.blockUp}>

                {
                  this.state.blocks.map((block, i) => (
                        <View style={styles.blockItem}>

                            <View style={styles.overLay}></View>

                            <View style={styles.blockImg}>
                                <TouchableOpacity style={styles.clickFav} onPress={()=>{this.Delet_favorite(block.id,i)}}>
                                      <Icon style={styles.iconFun} type="MaterialIcons" name="favorite"/>
                                </TouchableOpacity>

                                {/*<Image style={styles.Img} source={{ uri: block.image }}/>*/}

                              {
                                (block.image !== '')
                                    ?

                                      <Image style={styles.Img} source={{ uri: block.image }}/>

                                    :
                                      <Video
                                          source          = {{ uri: block.video }}
                                          resizeMode      = " cover "
                                          style           = { styles.Img }
                                          shouldPlay      = { false }
                                          isLooping       = { false }
                                      />
                              }

                            </View>

                              <TouchableOpacity style={styles.blockInfo} onPress={() => this.props.navigation.navigate('detailsadv', { id: block.id, video : block.video})}>
                                <View style={styles.view}>
                                    <Text style={styles.textN} numberOfLines={1} ellipsizeMode='tail'>{ block.title }</Text>
                                </View>
                                <View style={styles.view}>
                                    <Icon style={styles.iconN} type="AntDesign" name='user' />
                                    <Text style={styles.textN} numberOfLines={1} ellipsizeMode='tail'> { block.user } </Text>
                                </View>
                                <View style={styles.viewN}>
                                    <View style={styles.view}>
                                        <Icon style={styles.iconN} type="MaterialCommunityIcons" name='map-marker-outline' />
                                        <Text style={styles.textN} numberOfLines={1} ellipsizeMode='tail'> { block.city } </Text>
                                    </View>
                                    <Text style={styles.textN}>{ block.date }</Text>
                                </View>
                              </TouchableOpacity>

                        </View>
                  ))
                }
                     
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
  textLabel : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 18,
    marginVertical      : 8
  },
  bgImage : {
    flex                : 1,
    backgroundColor     : '#fff',
    zIndex              : 99,
    position            : "relative",
    top                 : 0,
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
  iconFun : {
    color               : "#F00",
    fontSize            : 16,
  },
  text : {
    color               : "#fff",
    position            : "relative",
    zIndex              : 99,
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 22
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
    fontSize            : 23,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 25,
  },
  blockItem : {
    position            : "relative",
    flexDirection       : "row",
    justifyContent      : "space-between",
    alignItems          : "center",
    borderRadius        : 5,
    backgroundColor     : "rgba(255, 255, 255, 0.6)",
    borderWidth         : 1,
    borderColor         : "#DDD",
    padding             : 10,
    marginVertical      : 10
  },
  overLay : {
    width                 : '107%',
    height                : 100,
    borderWidth           : 1,
    borderColor           : "#DDD",
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    left                  : -7,
    top                   : -7,
    position              : "absolute",
    zIndex                : -1,
  },
  blockImg : {
    flexBasis             : "30%",
    position              : "relative",
    overflow              : "hidden"
  },
  clickFav : {
    position              : "absolute",
    left                  : 0,
    top                   : 3,
    backgroundColor       : "rgba(255, 255, 255, 0.7)",
    padding               : 5,
    borderTopRightRadius   : 5,
    borderBottomRightRadius: 5,
    zIndex                : 9
  },
  Img : {
    width                 : "100%",
    height                : 70,
    borderRadius          : 5
  },
  blockInfo : {
    flexBasis             : "70%",
    paddingHorizontal     : 10
  },
  view : {
    alignSelf             : 'flex-start',
    flexDirection         : "row",
    alignItems            : "center"
  },
  textN : {
    color                 : "#4c4640",
    fontFamily            : "CairoRegular",
    fontSize              : 14,
  },
  iconN : {
    color                 : "#4c4640",
    fontSize              : 12,
  },
  viewN : {
    flexDirection         : "row",
    justifyContent        : "space-between",
    alignItems            : "center"
  },
  
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { profile  })(Favorite);