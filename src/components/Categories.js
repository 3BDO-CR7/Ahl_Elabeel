import React, { Component } from 'react';
import { StyleSheet, View, Text, I18nManager, Image, TouchableOpacity} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, CheckBox,Radio,Toast  } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import Spinner from 'react-native-loading-spinner-overlay';

import * as Animatable from 'react-native-animatable';

class categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked               : false,
      spinner               : false,
      Categories            : [],
      Categories_id         : '',
      Categories_name       : '',
      Sub_Categories        : '',
      has_Colors            : ''
    };
  }

  async componentWillMount() {

    this.setState({spinner :  true});

    axios({
        url     : CONST.url + 'getCategories',
        method  : 'GET',
    }).then(response => {
       
      this.setState({
        Categories        :  response.data.data,
        spinner           :  false
      });
       
    }).catch(err => { 
      console.log(err);
    });

  }

  onCheckBoxPress(id,Sub_Categories,color,name) {

    this.setState({
      selectedId        : id,
    });

    this.state.Categories_id          = id
    this.state.Sub_Categories         = Sub_Categories
    this.state.has_Colors             = color
    this.state.Categories_name        = name

  }

  getCategories(){
    
    this.setState({spinner :  true});

    if(this.state.Categories_id <= 0){
      Toast.show({ 
        text        : 'يرجي تحديد قسم', 
        duration    : 2000,
        type        : "danger", 
        textStyle     : {  
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   :'center' 
          } 
        });
    }else{
      this.props.navigation.navigate('forme3lan', {
        Categories_id           : this.state.Categories_id,
        Sub_Categories          : this.state.Sub_Categories,
        has_Colors              : this.state.has_Colors,
        Categories_name         : this.state.Categories_name,
      });

      this.setState({spinner :  false});
    }

  }


  static navigationOptions = () => ({
    drawerLabel : () => null,  
  });

  render() {
    
    const img  =  
    <View style = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style={{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
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
            <Title style={styles.Title}>الآقسام</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgImage}>
                <View style={styles.blockForm}>

                    {
                        this.state.Categories.map((Cate, i) => (
                              <TouchableOpacity style={styles.blockUp} onPress={() => this.onCheckBoxPress(Cate.id,Cate.hasSubCategories,Cate.hasColors,Cate.name)}>
                                    <CheckBox
                                      style={styles.checkBox}
                                      color={"#fff"}
                                      selectedColor={"#504b45"}
                                      checked={this.state.selectedId == Cate.id}
                                    />
                                    <View style={styles.blockChick}>
                                      <View style={[styles.imgBlock, { backgroundColor: Cate.color }]}>
                                        <Image style={styles.Img} source={{ uri: Cate.icon }} resizeMode="contain" />
                                      </View>
                                      <Text style={styles.nameBlock}>{ Cate.name }</Text>
                                  </View>
                              </TouchableOpacity>
                        ))
                    }

                </View>

                <TouchableOpacity style={styles.clickFunction} onPress={() => this.getCategories()}>
                    <Text style={styles.textFun}>تآكيد</Text>
                </TouchableOpacity>

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
    zIndex              : 99,
    position            : "relative",
    top                 : 30
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
    textAlign           : "center"
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : 40,
  },
  upBlock : {
    minHeight           : 90,
  },
  bgDiv : {
    paddingRight        : 10,
    paddingLeft         : 10,
  },
  blockForm : {
    flexDirection       : "row",
    flexWrap            : "wrap",
    padding             : 10,
  },
  blockUp : {
    position            : "relative",
    flexBasis           : "50%",
    marginVertical      : 5,
    padding             : 5,
    zIndex              : 99,
  },
  block_item : {
    flexBasis           : "50%",
    padding             : 5,
    marginVertical      : 2,
  },
  checkBox : {
    position            : 'absolute',
    right               : 15,
    top                 : 15,
    zIndex              : 9,
    left                : "auto",
    paddingLeft         : 0,
    paddingBottom       : 0,
    borderColor         : '#504b45',
    borderRadius        : 50,
    backgroundColor     : "#524d47",
    paddingRight        : 3
  },
  imgBlock : {
    borderRadius        : 10,
    margin              : 5,
    height              : 120,
    width               : "100%",
    overflow            : "hidden",
    padding             : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  },
  Img : {
    width               : 70,
    height              : 70,
    resizeMode          : "contain"
  },
  colorPink : {
    backgroundColor     : "rgb(103, 185, 171)",
  },
  colorGreen : {
    backgroundColor     : "rgb(142, 125, 141)",
  },
  colorBlue : {
    backgroundColor     : "rgb(144, 173, 249)",
  },
  colorYellow : {
    backgroundColor     : "rgb(246, 207, 130)",
  },
  colorPupe : {
    backgroundColor     : "rgb(187, 116, 149)",
  },
  colorGrow : {
    backgroundColor     : "rgb(138, 156, 151)",
  },
  nameBlock : {
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 14,
    textAlign           : "center"
  },
  clickFunction : {
    backgroundColor     : "#dba261",
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    borderRadius        : 10,
    margin              : 10,
    marginBottom        : 60,
    padding             : 5,
    width               : 120,
  },
  textFun : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
  }
});


export default categories;