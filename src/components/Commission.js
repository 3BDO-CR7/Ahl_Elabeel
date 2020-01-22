import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity,AsyncStorage} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, CheckBox,Radio,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import Spinner from 'react-native-loading-spinner-overlay';

class Commission extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked       : false,
      spinner       : false,
      commission    : '',
      banks         : [],
      number        : '',
    };
  }

  async componentWillMount() {
    
    I18nManager.forceRTL(true)


    this.setState({spinner :  true});

    axios({
      url     : CONST.url + 'appCommission',
      method  : 'GET',
    }).then(response => {
      
      this.setState({
        commission    :  response.data.data.commission,
        banks         :  response.data.data.banks,
        spinner       :  false
      });
      
    }).catch(err => { 
      console.log(err);
    });

  }

  onCheckBoxPress(id) {
    this.setState({
      selectedId  : id,
    });
    this.state.number = id
  }

  moveBank(){
    if(this.state.number <= 0){
      Toast.show({ text: 'يرجي إختيار بنك للمتابعه', duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
    }else{
      this.props.navigation.navigate('banktransfer', {
        id : this.state.number,
      });
    }
  }

  static navigationOptions = () => ({
    header      : null,
    drawerLabel : ( <Text style={styles.textLabel}>حساب العموله</Text> ) ,
    drawerIcon  : ( <Icon style={styles.icon} type="SimpleLineIcons" name="pencil" /> )
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
            <Title style={styles.Title}>حساب العموله</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <View style={styles.bgImage}>
                <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
                <View style={styles.blockAbout}>
                    <Text style={styles.textInfo}>
                        -- حساب العموله الخاصه بآهل الابل
                    </Text>
                    <Text style={styles.text}>{ this.state.commission }</Text>
                    <Text style={styles.textInfo}>
                        -- آختر البنك المراد التحويل له
                    </Text>
                    {
                        this.state.banks.map((bank, i) => (
                            <TouchableOpacity style={styles.blockUp}
                            onPress={() => this.onCheckBoxPress(bank.id)}>
                            <CheckBox
                              style={styles.checkBox}
                              color={"#fff"}
                              selectedColor={"#504b45"}
                              checked={this.state.selectedId == bank.id}
                            />
                            <View style={styles.blockChick}>
                                <View style={styles.imgBank}>
                                    <Image style={styles.Bank} source={{ uri: bank.image }} resizeMode={'contain'}/>
                                </View>
                                <View>
                                    <View style={styles.blockInfo}>
                                        <Text style={styles.nameBank}>البنك : </Text>
                                        <Text style={styles.bankInfo}>{ bank.name }</Text>
                                    </View>
                                    <View style={styles.blockInfo}>
                                        <Text style= {styles.nameBank}>رقم الحساب : </Text>
                                        <Text style={styles.bankInfo}>{ bank.account_number }</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        ))
                    }
                    <TouchableOpacity style={styles.clickMore} onPress={() => this.moveBank()}>
                        <Text style={styles.textMore}>إستكمال</Text>
                    </TouchableOpacity>
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
    marginBottom        : 15,
    textAlign           : "left"
  },
  textInfo : {
    color               : "#504b45",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    paddingHorizontal   : 10,
    marginBottom        : 15,
    textAlign           : "left"
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
  blockUp : {
    position            : "relative",
    backgroundColor     : "#fbe2d1",
    borderRadius        : 10,
    padding             : 20,
    margin              : 10
  },
  checkBox : {
    position            : 'absolute',
    right               : 10,
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
    width               : 50,
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
  
});


export default Commission;