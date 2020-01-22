import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,KeyboardAvoidingView, I18nManager } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, CheckBox, Form, Item, Input, Label,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'

import {ImagePicker, Permissions, Constants} from 'expo';

class BankTransfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spinner               : false,
      id                    : this.props.navigation.getParam('id'),
      name                  : '',
      account_number        : '',
      iban_number           : '',
      account_name          : '',
      image                 : null,
      is_image              : '',
      is_bank_name          : '',
      is_user_name          : '',
      is_account_number     : '',
      is_ammount            : ''
    };
  }
 
  async componentWillMount() {
    
    I18nManager.forceRTL(true);

    this.setState({spinner :  true});

    axios({
        url     : CONST.url + 'getSelectedBank',
        method  : 'POST',
        data      : { 
          bank_id    : this.state.id,
        }
    }).then(response => {
       
      this.setState({
        name                  :  response.data.data.name,
        account_number        :  response.data.data.account_number,
        iban_number           :  response.data.data.iban_number,
        account_name          :  response.data.data.account_name,
        image                 :  response.data.data.is_image,
        spinner               :  false
      });
       
    }).catch(err => { 
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
    }).then(() =>{
      this.setState({spinner :  false});
    })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  sentTransfer(){

    this.setState({spinner :  true});

      axios({
        url       : CONST.url + 'addTransfer',
        method    : 'POST',
        data      : { 
          bank_id                     : this.state.id,
          bank_name                   : this.state.is_user_name,
          user_name                   : this.state.is_user_name,
          user_account_number         : this.state.is_account_number,
          ammount                     : this.state.is_ammount,
          image                       : this.state.image
        }
      }).then(response => {

        this.setState({spinner :  false});

        Toast.show({
          text        : response.data.message, 
          duration    : 2000,
          type        : response.data.success === true ? "success" : "danger",
          textStyle   : { 
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center' 
          } 
        });
        
        if(response.data.success === true){
          this.props.navigation.navigate('commission');
        }
        
      }).catch(err => { 
        console.log(err);
        this.setState({spinner :  false});
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
    drawerLabel : () => null,  
  });

  render() {


    let { image } = this.state;

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
            <Title style={styles.Title}>تحويل بنكي</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <KeyboardAvoidingView behavior={'padding'} style={{ flex : 1 }}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.blockAbout}>
                    <View style={styles.blockUp}>
                        <CheckBox 
                            style={styles.checkBox} 
                            checked={true}
                        />
                        <View style={styles.blockChick}>
                            <View style={styles.imgBank}>
                                <Image style={styles.Bank} source={{ uri: this.state.is_image }} resizeMode={'cover'}/>
                            </View>
                            <View>
                                <View style={styles.blockInfo}>
                                    <Text style={styles.nameBank}>البنك : </Text>
                                    <Text style={styles.bankInfo}>{ this.state.name }</Text>
                                </View>
                                <View style={styles.blockInfo}>
                                    <Text style={styles.nameBank}>رقم الحساب : </Text>
                                    <Text style={styles.bankInfo}>{ this.state.account_number }</Text>
                                </View>
                                <View style={styles.blockInfo}>
                                    <Text style={styles.nameBank}>اسم الحساب : </Text>
                                    <Text style={styles.bankInfo}>{ this.state.account_name }</Text>
                                </View>
                                <View style={styles.blockInfo}>
                                    <Text style={styles.nameBank}> : IBAN</Text>
                                    <Text style={styles.bankInfo}>{ this.state.iban_number }</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    <Form style={styles.formControl}>
                        <Item floatingLabel style={styles.item}>
                            <Label style={styles.label}>اسم البنك المحول له</Label>
                            <Input style={styles.input} onChangeText={(is_bank_name) => this.setState({ is_bank_name })} auto-capitalization={false}/>
                        </Item>
                        <Item floatingLabel style={styles.item}>
                            <Label style={styles.label}>اسم صاحب الحساب</Label>
                            <Input style={styles.input} />
                            <Input style={styles.input} onChangeText={(is_user_name) => this.setState({ is_user_name })} auto-capitalization={false}/>
                        </Item>
                        <Item floatingLabel style={styles.item}>
                            <Label style={styles.label}>رقم الحساب</Label>
                            <Input style={styles.input} />
                            <Input style={styles.input} onChangeText={(is_account_number) => this.setState({ is_account_number })} keyboardType={'number-pad'}/>
                        </Item>
                        <Item floatingLabel style={styles.item}>
                            <Label style={styles.label}>المبلغ المراد سداده</Label>
                            <Input style={styles.input} />
                            <Input style={styles.input} onChangeText={(is_ammount) => this.setState({ is_ammount })} keyboardType={'number-pad'}/>
                        </Item>
                        <View>
                          <View style={styles.imagePicker}>
                            <Button transparent onPress={this._pickImage} style={styles.clickOpen}>
                              <Icon style={styles.iconImage} active type="AntDesign" name='plus' />
                              <Text style={styles.textImg}>صوره إيصال التحويل</Text>
                            </Button>
                            {image && <Image resizeMode="cover" source={{ uri: image }} style={styles.imgePrive}/>}
                          </View>
                        </View>
                    </Form>
                    
                    <TouchableOpacity style={styles.clickMore} onPress={() => this.sentTransfer()}>
                        <Text style={styles.textMore}>إستكمال</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
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
  },
  Title : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 16,
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
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    paddingHorizontal   : 10,
    marginBottom        : 15
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
  formControl : {
    padding             : 15,
    overflow            : "hidden"
  },
  item : {
    width               : "100%",
    marginLeft          : 0,
    marginRight         : 0,
    marginTop           : 15,
    padding             : 0,
    borderBottomWidth   : 0,
  },
  label : {
    width               : "95%",
    color               : '#bbb', 
    borderWidth         : 0,
    padding             : 10,
    top                 : 3,
    fontFamily          : 'CairoRegular',
    textAlign           : "left",
    fontSize            : 14,
    // zIndex              : 9,
    backgroundColor     : '#ffffff',
    opacity             : 1,
    paddingTop          : 0,
    paddingBottom       : 0,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  },
  input : {
    borderColor         : '#e9e8e8',
    borderWidth         : 1,
    borderRadius        : 5,
    width               : "100%",
    color               : '#dba261',
    padding             : 5,
    textAlign           : 'right',
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
  blockUp : {
    position            : "relative",
    backgroundColor     : "#fbe2d1",
    borderRadius        : 10,
    padding             : 20,
    margin              : 10
  },
  checkBox : {
    position            : 'absolute',
    right               : 15,
    top                 : 10,
    zIndex              : 9,
    left                : "auto",
    paddingLeft         : 0,
    paddingBottom       : 0,
    borderColor         : '#504b45',
    borderRadius        : 50,
    backgroundColor     : "#524d47",
    paddingRight        : 1
  },
  blockChick : {
    flexDirection       : 'row',
    justifyContent      : "space-around",
    alignItems          : "center"
  },
  imgBank : {
    flexBasis           : '30%',
  },
  blockInfo : {
    flexDirection       : 'row',
    flexBasis           : '70%',
  },
  Bank : {
    width               : '100%',
    height              : 50 
  },
  nameBank : {
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 13,
  },
  bankInfo : {
    color               : "#a7a6a8",
    fontFamily          : "CairoRegular",
    fontSize            : 13,
  },
  clickMore : {
    backgroundColor     : "#dba261",
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    borderRadius        : 10,
    margin              : 10,
    padding             : 5,
    width               : 120,
  },
  textMore :{
    color               : "#FFF",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
  },
  imagePicker : {
    position            : 'relative',
    overflow            : "hidden",
    borderRadius        : 5,
    borderColor         : '#e9e8e8',
    borderWidth         : 1,
    marginVertical      : 20,
    paddingHorizontal   : 10,
    width               : "100%",
  },
  clickOpen : {
    width               : "100%",
    height              : 100,
    justifyContent      : 'center',
    alignItems          : "center",
    borderRadius        : 5,
  },
  textImg : {
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 14,
  },
  iconImage: {
    marginRight         : 0,
    marginLeft          : 0,
    color               : "#504b45",
    padding             : 0,
    fontSize            : 16,
    marginHorizontal    : 20 
  },
  imgePrive : {
    position            : "absolute",
    top                 : 0,
    width               : "100%",
    height              : "100%",
    borderRadius        : 5,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  }
  
});

const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile  })(BankTransfer);