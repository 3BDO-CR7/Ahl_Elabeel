import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity,ImageEditor,ImageStore,ScrollView, I18nManager} from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, Form, Item, Input, Label, Picker, Textarea,ActionSheet ,Toast,ListItem,CheckBox} from 'native-base'

import axios from "axios";
import CONST from "../consts";

import { connect } from 'react-redux';
import { userLogin, profile} from '../actions'
import * as Permissions from 'expo-permissions'
import {NavigationEvents} from "react-navigation";

import Spinner from 'react-native-loading-spinner-overlay';

import {ImageBrowser,CameraBrowser} from 'expo-multiple-imagepicker';

import * as ImagePicker from 'expo-image-picker'


let    base_64   = [];
let    Base64_   = [];

let BUTTONS = [
  { text: 'معرض الصور'    ,i      : 0},
  { text: 'الكاميرا'      ,i      : 1},
  { text: 'معرض الفيديو ' ,i      : 2},
  { text: 'إلغاء'         ,color  : "#ff5b49" }
];

let DESTRUCTIVE_INDEX     = 3;
let CANCEL_INDEX          = 3;

class FormE3lan extends Component {

  constructor(props) {
    super(props);
    this.state = {
        cities                  : [],
        countries               : [],
        all_Color               : [],
        sub_category            : [],
        arr_images              : [],
        arr_videos              : [],
        country_id              : '',
        city_id                 : '',
        user_id                 : '',
        category_id             : '',
        sub_category_id         : '',
        color_id                : null,
        title                   : '',
        price                   : '',
        mobile                  : '',
        description             : '',
        video                   : '',
        latitude                : '',
        longitude               : '',
        hasSubCategories        : 0,
        hasColors               : 0,
        category_name           : null,
        city_name               : null,

        is_chat                 : false,
        is_phone                : false,
        is_whatsapp             : false,
        
        spinner                 : false,

        video_base64            : '',
        image                   : null,
        imageBrowserOpen        : false,
        cameraBrowserOpen       : false,
        photos                  : [],
        images                  : [],
        base_64                 : [],
        Base64                  : [],            
        formData                : new FormData(),

    };
  }

    componentDidMount() {
           if(base_64.length > 0 ) {
               base_64   = [] ;
           }



           if(Base64_.length > 0 ) {
               Base64_   = [];
           }
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {

        await Permissions.askAsync(Permissions.CAMERA);
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

    };


    componentWillMount() {


    I18nManager.forceRTL(true);

    this.setState({spinner : true});

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

    }

    /// serves countries

    axios({
      url       : CONST.url + 'countries',
      method    : 'GET',
    }).then(response => {
      
      this.setState({
        countries     :  response.data.data,
        spinner       :  false 
      });
      
    }).catch(err => { 
      console.log(err);
    });


    if(this.props.navigation.getParam('Categories_id') !== null && this.props.navigation.getParam('Categories_id') !== undefined);
    {

     let val = JSON.stringify(this.props.navigation.getParam('Categories_id'))
     setTimeout(()=> {
   
      axios({
        url       : CONST.url + 'getSelectedSubCategories',
        method    : 'POST',
        data      : {
          category_id :  val 
        }
      }).then(response => {
        

        let result = response.data.data;
        if(result.length > 0)
        {
          this.setState({
          
            sub_category      :  response.data.data,
     
         });
        }
       
      }).catch(err => { 
        console.log(err);
      });

     } , 2000)
        
    }

    if(this.props.navigation.getParam('has_Colors'));
    {
      this.getColors();
    }


    this.setState({hasSubCategories     : this.props.navigation.getParam('Sub_Categories')})
    this.setState({hasColors            : this.props.navigation.getParam('has_Colors')})

  
    if(this.props.navigation.getParam('latitude') || this.props.navigation.getParam('longitude')){
      this.state.city_name      =  this.props.navigation.getParam('city_name')
      this.setState({latitude   : this.props.navigation.getParam('latitude')})
      this.setState({longitude  : this.props.navigation.getParam('longitude')})
    }else{
      this.setState({city_name  : 'الموقع علي الخريطه'})
    }

    if(this.props.navigation.getParam('Categories_name')){
      this.setState({category_name : this.props.navigation.getParam('Categories_name')})
    }else{
      this.setState({category_name : 'الآقسام'})

    }

  }

  /// serves getColors

  getColors(){
    axios({
      url       : CONST.url + 'getColors',
      method    : 'GET',
    }).then(response => {
      
      this.setState({
        
        all_Color         :  response.data.data,
        spinner           :  false
  
      });
      
    }).catch(err => { 
      console.log(err);
    });
  }

  onFocus(){
      this.componentWillMount();
  }

  renderImage(item, i) {
    return (
        <View key={i} style={{ marginHorizontal : 5 }}>

            <Image 
            style={{
              height                : 70, 
              width                 : 70, 
              marginHorizontal      : 0, 
              borderRadius          : 5
            }}
            source={{
              uri                   : item
            }} 
            key={i} />

            <TouchableOpacity onPress={() => {this.delete_img(i)}} 
            style={{
                position            : 'absolute',
                right               : 0,
                top                 : 0,
                backgroundColor     : '#dba2617d',
                width               : 70,
                height              : 70,
            }}>

            <Icon name="close" 
            style={{
              color                 : 'white', 
              textAlign             : 'center', 
              fontSize              : 20,
              position              : 'relative',
              top                   : 25
            }}>
            </Icon>

            </TouchableOpacity>
        </View>
    )
  }

  onValueChange(value) {

    
    this.setState({spinner :  true});

    this.setState({ country_id: value});

    setTimeout(()=>{

          axios({
            url       : CONST.url + 'selectedCities',
            method    : 'POST',
            data      : { country_id: this.state.country_id }
          }).then(response => {
            
            this.setState({
              cities    :  response.data.data,
              spinner   :  false
            });
            
          }).catch(err => { 
            console.log(err);
          });

    },1500);

  }

  onValueChangeCity(value) {
    this.setState({
      city_id: value
    });
  }

  Value_sub_category(value) {
    this.setState({
      sub_category_id: value
    });
  }

  Value_All_Color(value) {
    this.setState({
      color_id: value
    });
  }

  open() {
    ActionSheet.show(
        {
            options                   : BUTTONS,
            cancelButtonIndex         : CANCEL_INDEX,
            destructiveButtonIndex    : DESTRUCTIVE_INDEX,
            title                     : 'آختر طريقه العرض'
        },
        buttonIndex => {
            this.images_video(BUTTONS[buttonIndex])
        }
    )
  }

  images_video = async (i) => {

        console.log(i);

    if (i.i === 0) {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            base64 : true
        });

        if (!result.cancelled) {
            this.setState({
                imageBrowserOpen: false,
                cameraBrowserOpen: false,
                photos: this.state.photos.concat(result.uri)
            });

            base_64.push(result.base64);

            // const imageUrls = result.uri;
            // Image.getSize(imageUrls, (width, height) => {
            // let imageSize = {
            //         size: {
            //             width,
            //             height
            //         },
            //         offset: {
            //             x: 0,
            //             y: 0,
            //         },
            //     };
            //
            //     ImageEditor.cropImage(imageUrls, imageSize, (imageURI) => {
            //         ImageStore.getBase64ForTag(imageURI, (base64Data) => {
            //             base_64.push(base64Data);
            //         }, (reason) => console.log(reason))
            //     }, (reason) => console.log(reason))
            //       }, (reason) => console.log(reason))
              }
            } else if (i.i === 1) {

               console.log('go go go');
                this.setState({cameraBrowserOpen: true});

          } else if (i.i === 2) {
        console.log('do  do  do');

              let result = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: true,
                  aspect: [4, 3],
                  mediaTypes: 'Videos',
                  quality: 0
              });

              if (!result.cancelled) {
                  this.setState({video: result.uri ,video_base64:result.base64, image: result.uri});
              }

              let localUri = result.uri;
              let filename = localUri.split('/').pop();

              let match = /\.(\w+)$/.exec(filename);
              let type = match ? `video/${match[1]}` : video;
              this.state.formData.append('videos', {
                  uri: localUri, name: filename, type
              });
        }
   };

  imageBrowserCallback = (callback) => {

    callback.then((photos) => {

       this.setState({
               imageBrowserOpen: false,
               cameraBrowserOpen: false,

           });

        const imgs = photos;


        for (let i = 0; i < imgs.length; i++) {

            const imageURL = imgs[i].file;

            this.setState({
                photos: this.state.photos.concat(imgs[i].file)

            });
            Image.getSize(imageURL, (width, height) => {

                let imageSize = {
                    size: {
                        width,
                        height
                    },
                    offset: {
                        x: 0,
                        y: 0,
                    },
                };

                ImageEditor.cropImage(imageURL, imageSize, (imageURI) => {
                    ImageStore.getBase64ForTag(imageURI, (base64Data) => {
                        base_64.push(base64Data);
                    }, (reason) => console.log(reason))
                }, (reason) => console.log(reason))
            }, (reason) => console.log(reason))
        }
       }).catch((e) => console.log( e))
};

  delete_img(i) {
    this.state.photos.splice(i, 1);
    base_64.splice(i, 1);
    this.setState({photos: this.state.photos})
  }

  delete_video(i) {

    this.setState({image: null, video: ''})

  }

  validate = () => {
    let isError = false;
    let msg     = '';

    if (this.state.title === '' || this.state.title === undefined) {
      isError   = true;
      msg       = 'إختر إسم الإعلان';
    }else if (!this.props.navigation.getParam('Categories_id')) {
      isError   = true;
      msg       = 'إختر القسم الرئيسي';
    }else if (this.state.hasSubCategories === 1 && this.state.hasSubCategories === '') {
      isError   = true;
      msg       = 'إختر القسم الفرعي';
    }else if (this.state.hasColors === 1 && this.state.hasColors === '') {
      isError   = true;
      msg       = 'إختر لون الإبل';
    }else if (this.state.price.length <= 0) {
      isError   = true;
      msg       = 'إدخل السعر';
    }else if (this.state.mobile <= 0) {
      isError   = true;
      msg       = 'إدخل رقم الهاتف';
    }else if (this.state.country_id <= 0) {
      isError   = true;
      msg       = 'إختر البلد';
    }else if (this.state.city_id <= 0) {
      isError   = true;
      msg       = 'إختر المدينه';
    }else if (this.state.latitude === undefined || this.state.longitude === undefined) {
      isError   = true;
      msg       = 'إختر الموقع من الخريطه';
    }else if (this.state.description <= 0) {
      isError   = true;
      msg       = 'آكتب شئ عن الإعلان';
    }

    if (msg !== ''){
        Toast.show({ 
          text          : msg, 
          duration      : 2000,
          type          : "danger", 
          textStyle     : {  
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   : 'center' 
          }
        });
    }
    return isError;
  };

  getAdd(){

    const err = this.validate();

    if (!err){

      this.setState({spinner :  true});

      axios({
        url       : CONST.url + 'storeAdvertisementApi',
        method    : 'POST',
        data      : { 
          user_id                : this.props.auth.data.user.id,
          title                  : this.state.title,
          category_id            : this.props.navigation.getParam('Categories_id'),
          country_id             : this.state.country_id,
          city_id                : this.state.city_id,
          price                  : this.state.price,
          mobile                 : this.state.mobile,
          description            : this.state.description,
          latitude               : this.state.latitude,
          longitude              : this.state.longitude,
          sub_category_id        : this.state.sub_category_id,
          color_id               : this.state.color_id,
          is_phone               : this.state.is_phone,
          is_whatsapp            : this.state.is_whatsapp,
          is_chat                : this.state.is_chat,
          images                 :  base_64.concat(Base64_)
        }
      }).then(response => {
        if(response.data.success === true){

          Toast.show({
            text        : 'إنتظر قليلا',
            type        : "success",
            duration    : 3000,
            textStyle   : { 
              color       : "white",
              fontFamily  : 'CairoRegular',
              textAlign   : 'center' 
            }
          });

          this.state.formData.append(
            'advertisement_id',response.data.data
          );

            this.setState({
                spinner       :  true,
                photos                  : [],
                images                  : [],
                base_64                 : [],
                Base64                  : [],
            });

            base_64     = [];
            Base64_     = [];

 
        }

         
      }).catch(err => {
          this.setState({spinner :  false});
          console.log(err.message);
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
      }).then((e)=>{
           this.setState({spinner :  true});
          axios({
              url       : CONST.url + 'uploadAdvertisementVideos',
              method    : 'POST',
              data      : this.state.formData
          }).then(response => {

              this.props.navigation.navigate('home');

              this.setState({
                  spinner       :  false,
                  base_64       : [],
                  Base64_       : [],
              });


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
              this.setState({spinner :  false});
              console.log(err.message);
              Toast.show({
                  text        : 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
                  type        : "danger",
                  duration    : 3000
              });
              console.log('hi 2');

          }).then(()=>{
              this.setState({spinner :  false});
              // this.props.navigation.navigate('home');
          });

      });

    }

  }

  static navigationOptions = () => ({
    header        : null,
    drawerLabel   : null,
    drawerIcon    : null
  });

  render() {

      console.log('thes imsges lenght xxxx', base_64.length);

    if (this.state.imageBrowserOpen) {
      return(<ImageBrowser base64={true} max={8} callback={this.imageBrowserCallback}/>);
    }else if (this.state.cameraBrowserOpen) {
      return(<CameraBrowser base64={true} max={8} callback={this.imageBrowserCallback}/>);
    }
   
    const img       =  
    <View style     = {{ justifyContent : 'center', alignItems : "center", alignSelf : "center", padding : 20, borderRadius : 10 }}>
      <Image style  = {{ width: 100, height: 100 }}  source={require('../../assets/loading.gif')}/>
    </View>

    return (
      <Container>

      <NavigationEvents onWillFocus={() => this.onFocus()} />
  
      <Spinner 
        visible           = { this.state.spinner }
      />

        <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>إضافه إعلان</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 , zIndex : -1 }} style={styles.contentView}>
            <View style={styles.upBlock}></View>    
            <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
            <View style={styles.bgImage}>
                <View style={styles.blockForm}>
                    <Form style={styles.formControl}>

                      <View style={styles.uploadImg}>
                        <View style={styles.imagePicker}>
                          <View style={styles.overLay}></View>
                          <TouchableOpacity onPress={()=> this.open()} style={styles.clickOpen}>
                            <Icon style={styles.iconImage} active type="AntDesign" name='plus' />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.textInfo}>صوره الآعلان</Text>
                      </View>

                      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>

                          {this.state.photos.map((item,i) => this.renderImage(item,i))}

                      </ScrollView>

                        {

                            (this.state.video !== '')

                                ?
                                <Text style={styles.textInfo}>فيديو الآعلان</Text>
                                :
                                <View></View>

                        }
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>


                          {

                              (this.state.video !== '')

                              ?
                              <View style={{ marginHorizontal : 5 }}>
                                  <Image source={{uri: this.state.image}}
                                  style={{
                                    height            : 70,
                                    width             : 70,
                                    borderRadius      : 5,
                                    marginHorizontal  : 0
                                  }}/>
                                  <TouchableOpacity onPress={()=> {this.delete_video()}}
                                  style={{
                                    position          : 'absolute',
                                    left              : 0,
                                    top               : 0,
                                    backgroundColor   : '#dba2617d',
                                    width             : 70,
                                    height            : 70,
                                  }}>

                                  <Icon name="close"
                                  style={{
                                    color             : 'white',
                                    textAlign         : 'center',
                                    fontSize          : 20,
                                    position          : 'relative',
                                    top               : 25
                                  }}>
                                  </Icon>

                                  </TouchableOpacity>
                              </View>
                              : <View></View>
                          }
                      </ScrollView>

                      <TouchableOpacity style={styles.clickChoose} onPress={() => this.props.navigation.navigate('categories')}>
                        <Text style={styles.textMore}>
                            { this.state.category_name }
                        </Text>
                        <Icon style={styles.iconInput} type="Entypo" name="grid" />
                      </TouchableOpacity>
                        
                          {this.state.hasSubCategories === 1 ? (

                              <View style={styles.viewPiker}>
                              <Item style={styles.itemPiker} regular>
                                  <Picker
                                      iosHeader={'القسم الفرعي'}
                                      headerBackButtonText={'رجوع'}
                                      mode="dropdown"
                                      style={styles.Picker}
                                      placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                      selectedValue={this.state.sub_category_id}
                                      onValueChange={this.Value_sub_category.bind(this)}
                                      textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                      placeholder="القسم الفرعي"
                                      itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                                      
                                      {
                                          this.state.sub_category.map((sub, i) => (
                                              <Picker.Item key={i} label={sub.name} value={sub.id} />
                                          ))
                                      }
                                  
                                  </Picker>
                              </Item>
                              <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                              </View>

                          ) : (

                            <View></View>
                          )}    
                        
                          {this.state.hasColors === 1 ? (

                            <View style={styles.viewPiker}>
                            <Item style={styles.itemPiker} regular>
                                <Picker
                                    iosHeader={'الآلوان'}
                                    headerBackButtonText={'رجوع'}
                                    mode="dropdown"
                                    style={styles.Picker}
                                    placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                    selectedValue={this.state.color_id}
                                    onValueChange={this.Value_All_Color.bind(this)}
                                    textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                    placeholder="الآلوان"
                                    itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                                    <Picker.Item label='إختر اللون' value={null} />

                                    {
                                        this.state.all_Color.map((color, i) => (
                                            <Picker.Item key={i} label={color.name} value={color.id} />
                                        ))
                                    }
                                
                                </Picker>
                            </Item>
                            <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                        </View>

                          ) : (
                            
                            <View></View>
                          )} 


                      <Item floatingLabel style={styles.item}>
                        <Label style={styles.label}>إسم الإعلان</Label>
                        <Input style={styles.input} onChangeText={(title) => this.setState({ title })} auto-capitalization={false}/>
                      </Item>

                      <Item floatingLabel style={styles.item}>
                        <Label style={styles.label}>السعر</Label>
                        <Input style={styles.input} onChangeText={(price) => this.setState({ price })} auto-capitalization={false}/>
                      </Item>

                      <Item floatingLabel style={styles.item}>
                        <Label style={styles.label}>رقم الجوال</Label>
                        <Input style={styles.input} onChangeText={(mobile) => this.setState({ mobile })} keyboardType={'number-pad'}/>
                        {/* <Icon style={[styles.iconInput , styles.Top]} type="AntDesign" name="plus" /> */}
                      </Item>
                      
                      <View style={styles.blockPiker}>
  
                          <View style={styles.viewPiker}>
                              <Item style={styles.itemPiker} regular>
                                  <Picker
                                      iosHeader={'البلد'}
                                      headerBackButtonText={'رجوع'}
                                      mode="dropdown"
                                      style={styles.Picker}
                                      placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                      selectedValue={this.state.country_id}
                                      onValueChange={this.onValueChange.bind(this)}
                                      textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                      placeholder="البلد"
                                      itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                                      
                                      {
                                          this.state.countries.map((country, i) => (
                                              <Picker.Item key={i} label={country.name} value={country.id} />
                                          ))
                                      }
                                  
                                  </Picker>
                              </Item>
                              <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                          </View>

                          <View style={styles.viewPiker}>
                            <Item style={styles.itemPiker} regular>
                                <Picker
                                    iosHeader={'المدينه'}
                                    headerBackButtonText={'رجوع'}
                                    mode="dropdown"
                                    style={styles.Picker}
                                    placeholderStyle={{ color: "#121212", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                    selectedValue={this.state.city_id}
                                    onValueChange={this.onValueChangeCity.bind(this)}
                                    textStyle={{ color: "#121212",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                    placeholder="المدينه"
                                    itemTextStyle={{ color: '#121212',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                                    {
                                        this.state.cities.map((city, i) => (
                                            <Picker.Item key={i} label={city.name} value={city.id} />
                                        ))
                                    }
                                
                                </Picker>
                            </Item>
                            <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                        </View>

                      </View>
                      <ListItem style={styles.ListItem} onPress={() => this.setState({ is_phone: !this.state.is_phone, is_whatsapp: !this.state.is_whatsapp })}>
                        <CheckBox
                          style={styles.checkBox}
                          color={"#504b45"}
                          selectedColor={"#504b45"}
                          checked={this.state.is_phone}
                          value={this.state.is_phone}
                        />
                        <Body style={styles.bodyInfo}>
                          <Text style={styles.textMore}>إظهار رقم الهاتف</Text>
                        </Body>
                      </ListItem>

                      <ListItem style={styles.ListItem} onPress={() => this.setState({ is_chat: !this.state.is_chat })}>
                        <CheckBox
                          style={styles.checkBox}
                          color={"#504b45"}
                          selectedColor={"#504b45"}
                          checked={this.state.is_chat}
                          value={this.state.is_chat}
                        />
                        <Body style={styles.bodyInfo}>
                          <Text style={styles.textMore}>تشغيل الدردشه</Text>
                        </Body>
                      </ListItem>

                      <TouchableOpacity style={styles.clickChoose} onPress={() => this.props.navigation.navigate('map')}>
                        <Text style={[styles.textMore , {width : 220}]} numberOfLines={1} ellipsizeMode='tail'>{ this.state.city_name }</Text>
                        <Icon style={styles.iconInput} type="MaterialCommunityIcons" name="map-marker-outline" />
                      </TouchableOpacity>

                      <Item style={[styles.item , styles.itemModel]}>
                          <Textarea onChangeText={(description) => this.setState({ description })} auto-capitalization={false} placeholderTextColor={'#bbb'} style={styles.writeModel} rowSpan={5} placeholder="وصف الآعلان" />
                      </Item>

                      <TouchableOpacity style={styles.clickFunction} onPress={() => this.getAdd()}>
                        <Text style={styles.textFun}>تآكيد</Text>
                      </TouchableOpacity>

                    </Form>
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
    zIndex              : 99,
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
    color               : "#363636",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    paddingHorizontal   : 10,
    marginBottom        : 15
  },
  textInfo : {
    color               : "#363636",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
    textAlign           : "center"
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : 60,
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
    overflow            : "hidden",
    top                 : -70,
    position            : 'relative'
  },
  clickChoose : {
    backgroundColor     : "#fff",
    borderColor         : '#e9e8e8',
    borderWidth         : 1,
    borderRadius        : 5,
    marginVertical      : 10,
    paddingHorizontal   : 5,
    flexDirection       : "row",
    justifyContent      : "space-between",
    alignItems          : "center",
    height              : 50,
    marginBottom        : 0
  },
  textMore : {
    color               : "#363636",
    fontFamily          : "CairoRegular",
    fontSize            : 14,
  },
  iconInput : {
    color               : '#363636',
    fontSize            : 19,
    paddingTop          : 0,
    paddingRight        : 0
  },
  Top : {
    top                 : 25,
    position            : "absolute",
    right               : 10,
  },
  item : {
    width               : "100%",
    marginLeft          : 0,
    marginRight         : 0,
    marginVertical      : 5,
    padding             : 0,
    borderBottomWidth   : 0,
    position            : "relative"
  },
  label : {
    color               : '#363636', 
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
    alignSelf           : 'flex-start',
  },
  input : {
    borderColor         : '#e9e8e8',
    borderWidth         : 1,
    borderRadius        : 5,
    width               : "100%",
    color               : '#363636',
    padding             : 5,
    textAlign           : 'right',
    fontFamily          : 'CairoRegular',
    fontSize            : 14,
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
    zIndex              : 999,
    marginHorizontal    : 10
  },
  imagePicker : {
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    margin                : 10,
    width                 : 110,
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
    width                 : 110,
    height                : 110,
    borderWidth           : 1,
    borderColor           : "#DDD",
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    left                  : -8,
    top                   : -8,
    position              : "absolute",
    zIndex                : -1
  },
  clickOpen : {
    width                 : 110,
    height                : 110,
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
  iconImage : {
    color                 : "#DDD"
  },
  imgePrive : {
    position              : 'absolute', 
    width                 : 130,
    height                : 130,
    alignItems            : 'center',
    justifyContent        : 'center', 
    alignSelf             : 'center',
    top                   : -10,
    // zIndex                : 9,
    borderRadius          : 10 
  },
  viewPiker : {
    position            : 'relative',
    marginVertical      : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  },
  Picker : {
    width               : '100%', 
    writingDirection    : 'rtl',
    borderWidth         : 0,
    paddingLeft         : 0,
    fontSize            : 18,
    fontFamily          : 'CairoRegular',
    backgroundColor     : 'transparent',
    marginRight         : 0,
    borderRadius        : 10,
    height              : 50,
  },
  itemPiker : {
    borderWidth         : 0,
    borderColor         : "#e9e8e8" ,
    width               : '100%',
    position            : 'relative',
    fontSize            : 18,
    fontFamily          : 'CairoRegular',
    borderRadius        : 5,
  },
  iconPicker : {
    position            : 'absolute',
    right               : 5,
    color               : "#504b45",
    fontSize            : 16
  },
  writeModel : {
    borderColor         : '#e9e8e8',
    borderWidth         : 1,
    borderRadius        : 5,
    width               : "100%",
    color               : '#363636',
    padding             : 5,
    paddingLeft         : 5,
    textAlign           : 'right',
    height              : 100,
    fontSize            : 13,
    fontFamily          : 'CairoRegular',
    marginTop           : 10
  },
  clickFunction : {
    backgroundColor     : "#363636",
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
  ListItem : {
    borderRadius        : 5,
    borderWidth         : 1,
    borderColor         : '#e9e8e8',
    marginLeft          : 0,
    marginVertical      : 10,
    paddingLeft         : 5,
    paddingRight        : 5,
    paddingBottom       : 0,
    paddingTop          : 0,
    justifyContent      : "space-between",
    flexDirection       : 'row'
  },
  checkBox : {
    paddingLeft         : 0,
    paddingBottom       : 0,
    borderColor         : '#504b45',
    backgroundColor     : "#524d47",
    paddingRight        : 0,
    marginLeft          : 0
  },
  bodyInfo : {
    paddingTop          : 10,
    paddingBottom       : 10,
    paddingRight        : 10,
    paddingLeft         : 10
  },
  blockPiker : {
    marginTop           : 15
  }
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin ,profile })(FormE3lan);