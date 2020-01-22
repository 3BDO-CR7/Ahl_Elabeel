import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, Form, Item, Input, Label, Textarea,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import Modal from "react-native-modal";

import Spinner from 'react-native-loading-spinner-overlay';

class Contact extends Component {

  constructor(props){
    super(props);
    this.state = {
        pageName            : this.props.routeName,
        phone               : '',
        email               : '',
        address             : '',
        socials             : [],
        spinner             : false,
        is_name             : '',
        is_email            : '',
        is_massage          : '',
        isModalVisible      : false,
        ismodalComment      : false
    }

  }

  componentWillMount() {
    
    I18nManager.forceRTL(true);

    this.setState({spinner :  true});
    
    axios({
        url       : CONST.url + 'callUs',
        method    : 'GET',
    }).then(response => {
       
      this.setState({
        phone       :  response.data.data.phone,
        email       :  response.data.data.email,
        address     :  response.data.data.address,
        socials     :  response.data.data.sites,
        spinner     :  false
      });
       
    }).catch(err => { 
      console.log(err);
    });
  }

  validate = () => {

    let isError     = false;
    let msg         = '';

    if (this.state.is_name.length <= 0) {
        isError     = true;
        msg         = 'إدخال اسم المستخدم';
    }else if (this.state.is_email.length <= 0) {
        isError     = true;
        msg         = 'إدخال البريد الإلكتروني';
    }else if (this.state.is_massage.length <= 0){
        isError     = true;
        msg         = 'ادخل الرساله الخاص بك';
    }

    if (msg != ''){
        Toast.show({ 
          text          : msg, 
          duration      : 2000,
          type          : "danger", 
          textStyle     : {  
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center',
          }
        });
    }
    return isError;
  };

  makeComplaints(){

    this.setState({spinner :  true});

    const err = this.validate();

    if (!err){

      axios({
        url       : CONST.url + 'makeComplaints',
        method    : 'POST',
        data      : { 
          name                        : this.state.is_name,
          email                       : this.state.is_email,
          content                     : this.state.is_massage,
        }
      }).then(response => {

        this.setState({spinner :  false});

        this.setState({ isModal: false });

        Toast.show({
          text        : response.data.message,
          type        : "success",
          duration    : 3000,
          textStyle       : {  
              color         : "white",
              fontFamily    : 'CairoRegular',
              textAlign     : 'center' 
          } 
        });
        
      }).catch(err => { 
        console.log(err);
        this.setState({ spinner: false });
        Toast.show({
            text        : 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
            type        : "danger",
            duration    : 3000, 
            textStyle       : {  
                color         : "white",
                fontFamily    : 'CairoRegular',
                textAlign     : 'center' 
            } 
        });
      });

    }else if(!this.props.auth){

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
        
    }


  }


  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  modalComment = () => {
    this.setState({ isModal: !this.state.isModal });
  };


  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>إتصل بنا</Text> ) ,
    drawerIcon  : ( <Icon style={styles.icon} type="AntDesign" name="contacts" /> )
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
            <Title style={styles.Title}>اتصل بنا</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.blockAbout}>
                    <Form style={styles.formControl}>
                        <TouchableOpacity onPress={() => {Linking.openURL('tel://' + this.state.phone )}}>
                            <Item floatingLabel style={styles.item}>
                                <Label style={styles.label}>رقم الجوال</Label>
                                <Input style={styles.input} value={ this.state.phone } disabled />
                                <Icon style={styles.iconInput} type="MaterialIcons" name="phone-iphone" />
                            </Item>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {Linking.openURL('mailto:' + this.state.email )}}>
                            <Item floatingLabel style={styles.item}>
                                <Label style={styles.label}>البريد الالكتروني</Label>
                                <Input style={styles.input} value={ this.state.email } disabled />
                                <Icon style={styles.iconInput} type="MaterialCommunityIcons" name="email-outline" />
                            </Item>
                        </TouchableOpacity>
                        <Item floatingLabel style={styles.item}>
                            <Label style={styles.label}>العنوان</Label>
                            <Input style={styles.input} value={ this.state.address } disabled />
                            <Icon style={styles.iconInput} type="MaterialCommunityIcons" name="map-marker-outline" />
                        </Item>
                    </Form>

                    <View style={styles.blockSocial}>
                        {
                            this.state.socials.map((social, i) => (
                                <TouchableOpacity style={styles.Button} key={i} onPress={() => Linking.openURL(social.url)}>
                                    <Image style={styles.social} source={{ uri: social.icon }} resizeMode={'contain'} />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    
                    <TouchableOpacity style={styles.clickMore} onPress={this.modalComment}>
                        <Text style={styles.textMore}>إرسال شكوي او استفسار</Text>
                    </TouchableOpacity>

                    <Modal 
                    isVisible={this.state.isModal} 
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
                    onBackdropPress={() => this.setState({ isVisible: false })}>
                      
                        <View style={styles.contentModel}>
                        
                            <Image style={[styles.curve , styles.curveModel]} source={require('../../assets/brown_curve.png')}/>
                            
                            <View style={styles.model}>

                              <Form style={styles.formControl}>
                                  <Item floatingLabel style={[styles.item , styles.itemModel]}>
                                      <Label style={[styles.label , styles.labelModel]}>اسم المستخدم</Label>
                                      <Input style={[styles.input , styles.inputModel]} onChangeText={(is_name) => this.setState({ is_name })} auto-capitalization={false}/>
                                  </Item>
                                  <Item floatingLabel style={[styles.item , styles.itemModel]}>
                                      <Label style={[styles.label , styles.labelModel]}>البريد الالكتروني</Label>
                                      <Input style={[styles.input , styles.inputModel]} onChangeText={(is_email) => this.setState({ is_email })} keyboardType={'email-address'}/>
                                  </Item>           
                                  <Item style={[styles.item , styles.itemModel]}>
                                      <Textarea placeholderTextColor={'#FFF'} onChangeText={(is_massage) => this.setState({ is_massage })} auto-capitalization={false} style={styles.writeModel} rowSpan={5} placeholder="الرساله" />
                                  </Item>
                              </Form>

                              <View style={styles.blockFunction}>
                                  <TouchableOpacity style={styles.clickFunction} onPress={() => this.makeComplaints()}>
                                      <Text style={styles.textFun}>إستكمال</Text>
                                  </TouchableOpacity>  

                                  <TouchableOpacity style={styles.iconClose} onPress={this.modalComment}>
                                      <Text style={styles.textFun}>إغلاق</Text>
                                  </TouchableOpacity> 
                              </View>

                            </View>
                        
                        </View>
                    
                    </Modal>

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
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 18,
    paddingHorizontal   : 10,
    marginBottom        : 15
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : 1,
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
  formControl : {
    padding             : 15,
    overflow            : "hidden"
  },
  item : {
    width               : "100%",
    marginLeft          : 0,
    marginRight         : 0,
    marginTop           : 25,
    padding             : 0,
    borderBottomWidth   : 0,
    position            : "relative",
  },
  iconInput : {
    position            : "absolute",
    top                 : 25,
    right               : 10,
    color               : '#dba261',
    fontSize            : 20,
    paddingTop          : 0,
    paddingRight        : 0
  },
  label : {
    color               : '#504b45', 
    borderWidth         : 0,
    padding             : 10,
    top                 : 5,
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
    zIndex              : -1,
    paddingTop          : 7
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
    fontSize            : 23,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 25,
  },
  blockSocial : {
    flexDirection       : 'row',
    justifyContent      : 'center',
    margin              : 20
  },
  Button : {
    backgroundColor     : 'transparent',
    shadowColor         : "transparent",
    shadowOffset        : { width: 0,height: 0 },
    elevation           : 0,
  },
  social : {
    width               : 40,
    height              : 40,
    margin              : 5,
    borderRadius        : 10/ 2
  },
  clickMore : {
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    borderRadius        : 10,
    margin              : 10,
    padding             : 5,
  },
  textMore :{
    color               : "#eb8588",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    textDecorationLine  : "underline" 
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
    top                 : -110
  },
  curveModel : {
    opacity             : 0.9,
    top                 : -79
  },
  itemModel : {
    
  },
  labelModel : {
    top                 : 2,
    backgroundColor     : 'transparent',
    color               : '#fff',
    zIndex              : -1,
  },
  inputModel : {
    borderColor         : '#fff',
    color               : '#fff',
  },
  writeModel : {
    borderColor         : '#fff',
    borderWidth         : 1,
    borderRadius        : 5,
    width               : "100%",
    color               : '#fff',
    padding             : 5,
    paddingLeft         : 5,
    textAlign           : 'right',
    height              : 100,
    fontSize            : 13,
    fontFamily          : 'CairoRegular',
    marginTop           : 10
  },
  blockFunction : {
    flexDirection         : 'row',
    justifyContent        : 'center',
    alignItems            : 'center'
  },
  clickFunction : {
    backgroundColor       : "#dba261",
    borderRadius          : 10,
    margin                : 10,
    padding               : 5,
    width                 : 120,
    justifyContent        : 'center', 
  },
  textFun : {
    color                 : "#fff",
    fontFamily            : "CairoRegular",
    fontSize              : 16,
    textAlign             : "center",
  },
  iconClose : {
    textAlign             : "center",
    borderRadius          : 10,
    backgroundColor       : "#F00",
    margin                : 10,
    padding               : 5,
    width                 : 120,
    justifyContent        : 'center', 
  },
  
});


export default Contact;