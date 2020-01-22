import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager,Image,TouchableOpacity, ScrollView,Linking  } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, Textarea, Form,Toast } from 'native-base'

import axios from "axios";
import CONST from "../consts";

import Swiper from 'react-native-swiper';
import  Modal  from "react-native-modal";
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import Spinner from 'react-native-loading-spinner-overlay';
import { Video } from 'expo-av'
import Lightbox from 'react-native-lightbox';

import { Modal as RNModal  } from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import {NavigationEvents} from "react-navigation";

class DetailsAdv extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageName        : this.props.routeName,
            id              : this.props.navigation.state.params.id,
            data            : '',
            count           : '',
            writecomment    : '',
            user_id_adv     : '',
            images          : [],
            videos          : '',
            isModalVisible  : false,
            is_video        : false,
            comments        : [],
            blocks          : [],
            allcomment      : [],
            show_modal      : false,
            is_favourite    : false,
            spinner         : false,
        };
    }

    async componentWillMount() {

        setTimeout(()=> {
            this.setState({videos : this.props.navigation.state.params.video,});

            console.log('video ==', this.props.navigation.state.params.video);

        }, 3000);

        I18nManager.forceRTL(true);

        this.setState({spinner :  true});

        axios({
            url       : CONST.url + 'advertisement',
            method    : 'POST',
            data      : {
                advertisement_id    : this.props.navigation.state.params.id,
                user_id             : (this.props.auth)?this.props.auth.data.user.id: null
            }
        }).then(response => {

            this.setState({
                images        : response.data.data.images,
                // videos        : this.props.navigation.state.params.video,
                // videos        : response.data.data.vedios,
                data          : response.data.data.advertisement,
                user_id_adv   : response.data.data.advertisement.user_id,
                comments      : response.data.data.comments,
                blocks        : response.data.data.similaradvertisements,
                region        : {
                    latitude          : response.data.data.advertisement.latitude,
                    longitude         : response.data.data.advertisement.longitude,
                },
                spinner       :  false,
            });

            let favorite = response.data.data.advertisement.favorite;

            if(favorite === 0){
                this.setState({is_favourite: false})
            }else{
                this.setState({is_favourite: true})
            }

        }).catch(err => {

            this.setState({spinner : false});

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


        axios({
            url       : CONST.url + 'advetisementAllComments',
            method    : 'POST',
            data      : {
                advertisement_id    : this.props.navigation.state.params.id
            }
        }).then(response => {

            if(response.data.data.length > 0){

                Toast.show({ text: 'لا توجد تعليقات', duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

            }else{

                this.setState({
                    allcomment        : response.data.data.comments,
                    count             : response.data.data.comments_number,
                });

            }

        }).catch(err => {
            console.log(err);
            this.setState({spinner : false});
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

    // state = {
    //     isModalVisible      : false,
    // };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    toggleVideo = () => {
        this.setState({ is_video: !this.state.is_video });
    };

    addComment(){

        this.setState({spinner :  true});

        if(this.state.writecomment === ''){

            Toast.show({ text: 'آدخل شئ للتعليق', duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

            this.setState({spinner : false});

        }else{
            axios({
                url       : CONST.url + 'addComment',
                method    : 'POST',
                data      : {
                    description         : this.state.writecomment,
                    advertisement_id    : this.props.navigation.state.params.id,
                    user_id             : (this.props.auth) ?this.props.auth.data.user.id: null
                }
            }).then(response => {

                this.setState({writecomment : ''});
                this.state.allcomment.push(response.data.data);
                this.setState({spinner :  false});

                this.setState({ count: this.state.allcomment.length });


            }).catch(err => {
                console.log(err);
                this.setState({spinner : false});
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

    }

    uptoDate(id){

        this.setState({spinner :  true});

        axios({
            url       : CONST.url + 'refreshAdvertisement',
            method    : 'POST',
            data      : {
                advertisment_id     : id,
                user_id             : (this.props.auth)?this.props.auth.data.user.id:null,
            }
        }).then(response => {

            Toast.show({ text: response.data.message, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

            this.setState({spinner : false});

        }).catch(err => {

            Toast.show({ text:response.data.message, duration : 2000  ,type :"warning", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

            console.log(err);
        });
    }

    favorite(id){

        this.setState({spinner :  true});

        if(this.state.is_favourite === false){
            axios({
                url       : CONST.url + 'addToFavorite',
                method    : 'POST',
                data      : {
                    advertisement_id    : id,
                    user_id             : (this.props.auth)?this.props.auth.data.user.id:null,
                }
            }).then(response => {

                Toast.show({ text: response.data.message, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

                this.setState({is_favourite: true});

                this.setState({spinner : false});

            }).catch(err => {

                Toast.show({ text:response.data.message, duration : 2000  ,type :"warning", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

                console.log(err);
            });
        }else{

            axios({
                url       : CONST.url + 'deleteFromFavorite',
                method    : 'POST',
                data      : {
                    advertisement_id    : id,
                    user_id             : (this.props.auth)?this.props.auth.data.user.id:null,
                }
            }).then(response => {

                this.setState({spinner : false});

                this.setState({is_favourite: false});

                Toast.show({ text: response.data.message, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

            }).catch(err => {
                console.log(err);
                this.setState({spinner : false});
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

    }

    onFocus(){
        this.componentWillMount();
    }

    // setAds(id){
    //     this.setState({ id, images: [], videos: [], comments: [], blocks: [], allcomment: [] });
    //     setTimeout(() => this.componentWillMount(), 0);
    // }

    render() {
        // const images = [{
        //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
        //     width: 500, height: 500
        // }];


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
                        <Title style={styles.Title}>تفاصيل الآعلان</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
                    <View style={styles.upBlock}></View>
                    <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>

                    <View style={styles.bgImage}>

                        <View style={styles.bgDiv}>

                            {
                                (this.props.navigation.state.params.video !== '')
                                // (this.state.videos.length > 0)
                                    ?
                                    <TouchableOpacity onPress={this.toggleVideo}  style={styles.block_slider}>
                                        <View style={styles.overLay}></View>
                                        <TouchableOpacity style={[styles.iconVideo]} onPress={this.toggleVideo}>
                                            <Icon style={styles.icons} type="AntDesign" name='playcircleo' />
                                        </TouchableOpacity>

                                        <View style={styles.slide}>
                                            <Video
                                                source          = {{ uri: this.props.navigation.state.params.video }}
                                                resizeMode      = "cover"
                                                shouldPlay      = {false}
                                                isLooping       = {false}
                                                style           = {styles.slide}
                                            />
                                        </View>

                                    </TouchableOpacity>
                                    :
                                    <View/>
                            }



                            {
                                (this.state.images.length > 0)
                                    ?
                                    <View style={styles.block_slider}>

                                        <View style={styles.overLay}/>

                                        {
                                            (this.props.auth)

                                                ?

                                                <TouchableOpacity style={[styles.clickFun , styles.clickFav]} onPress={()=>{this.favorite(this.props.navigation.state.params.id)}}>
                                                    <Icon style={[styles.iconFun , styles.iconRed]}  type="MaterialIcons" name={(this.state.is_favourite ===  true)? 'favorite' : 'favorite-border'}/>
                                                </TouchableOpacity>
                                                :

                                                <View/>
                                        }

                                        {
                                            this.props.auth && this.props.auth.data.user.id === this.state.user_id_adv && this.state.images.length > 0

                                                ?

                                                <TouchableOpacity style={[styles.clickFun , styles.clickUpdate]} onPress={()=>{this.uptoDate(this.props.navigation.state.params.id)}}>
                                                    <Icon style={[styles.iconFun , styles.colorGreen]}  type="AntDesign" name='reload1'/>
                                                </TouchableOpacity>
                                                :

                                                <View />
                                        }

                                        {
                                            (this.state.images.length > 0)
                                                ?
                                                <Swiper
                                                    containerStyle  = {styles.wrapper}
                                                    autoplay        = {true}
                                                    paginationStyle = {{ justifyContent : "flex-end", paddingHorizontal : 30 }}
                                                    dotStyle        = {{ backgroundColor: '#fff' }}
                                                    activeDotStyle  = {{ backgroundColor: '#4c4640', width: 20}}
                                                    animated        = {true}
                                                    loop            = {false}>
                                                    {
                                                        this.state.images.map((img, i) => (
                                                            <TouchableOpacity onPress={()=> { this.setState({show_modal : true})}} style={[styles.slide,{resizeMode :'contain' , height : 150}]} key={i}>

                                                                <Image style={styles.slide} source={{ uri: img.url }} resizeMode={'cover'}/>

                                                            </TouchableOpacity>
                                                        ))
                                                    }
                                                </Swiper>
                                                :
                                                <View/>
                                        }


                                    </View>
                                    :
                                    <View/>
                            }

                            <View style={styles.Contact}>

                                {
                                    (this.state.data.is_phone === 1)

                                        ?
                                        <TouchableOpacity style={[styles.clickNav , styles.bgBlue]}  onPress={()=> { Linking.openURL(`tel://${this.state.data.mobile}`)}}>
                                            <Text style={styles.text}>إتصال</Text>
                                            <Icon style={styles.iconFun} type="MaterialIcons" name='phone-iphone' />
                                        </TouchableOpacity>
                                        :
                                        <View/>
                                }

                                {
                                    (this.state.data.is_whatsapp === 1)

                                        ?
                                        <TouchableOpacity
                                            style={[styles.clickNav , styles.bgGreen]}
                                            onPress={()=> {Linking.openURL('http://api.whatsapp.com/send?phone=' + this.state.data.mobile);}}>
                                            <Text style={styles.text}>إرسال بالواتس</Text>
                                            <Icon style={styles.iconFun} type="FontAwesome" name='whatsapp' />
                                        </TouchableOpacity>
                                        :
                                        <View/>
                                }

                                {
                                    (this.state.data.is_chat === 1 && this.props.auth)

                                        ?
                                        <TouchableOpacity style={[styles.clickNav , styles.bgRed]}
                                                          onPress={()=>{
                                                              this.props.navigation.navigate('chatroom' , {
                                                                  other_user : this.state.data.user_id,
                                                                  room  : this.props.navigation.state.params.id
                                                              })
                                                          }}>
                                            <Text style={styles.text}>رساله خاصه</Text>
                                            <Icon style={styles.iconFun} type="MaterialCommunityIcons" name='email-outline' />
                                        </TouchableOpacity>
                                        :
                                        <View/>
                                }

                            </View>

                            <View style={styles.contentInfo}>
                                <View style={styles.overLay}></View>
                                <Text style={styles.titleAdv}>{ this.state.data.title }</Text>
                                <View style={styles.viewBlock}>
                                    <Icon style={styles.icon} type="MaterialCommunityIcons" name='map-marker' />
                                    <Text style={styles.conText}>{ this.state.data.country } - { this.state.data.city }</Text>
                                </View>
                                <View style={styles.viewBlock}>
                                    <Icon style={styles.icon} type="MaterialIcons" name='phone-iphone' />
                                    <Text style={styles.conText}>{ this.state.data.mobile }</Text>
                                </View>
                                <View style={styles.viewBlock}>
                                    <Icon style={styles.icon} type="AntDesign" name='user' />
                                    <Text style={[styles.conText,{fontSize:18}]}>{ this.state.data.user_name }</Text>
                                </View>
                                <Text style={styles.titleAdv}>الوصف</Text>
                                <Text style={[styles.conText,{fontSize: 22}]}>{ this.state.data.description }</Text>

                                <TouchableOpacity style={styles.clickMore} onPress={() => this.props.navigation.navigate('location', { Location: this.state.region})}>
                                    <Text style={styles.textMore}>مشاهده الموقع علي الخريطه</Text>
                                </TouchableOpacity>

                                <Text style={styles.conTitle}>المحادثه العامه</Text>

                                {/* <ScrollView style={{height : 400, width : '100%'}}> */}

                                {
                                    (this.state.comments.length > 0)
                                        ?

                                        <ScrollView style={{height : 200, width : '100%'}} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{ this.scrollView.scrollToEnd({animated: true})}}>
                                            <View>

                                                {
                                                    this.state.comments.map((comment, i) => (
                                                        <View style={styles.viewComment} key={i}>

                                                            <View style={styles.imgView}>
                                                                <Image style={styles.img} source={{uri: comment.user_avatar}}
                                                                       resizeMode={'cover'}/>
                                                            </View>
                                                            <View style={styles.infoComment}>
                                                                <View style={styles.infoComn}>
                                                                    <Text style={styles.titleAdv}>{comment.user_name}</Text>
                                                                    <Text style={styles.conText}>{comment.date}</Text>
                                                                </View>
                                                                <Text style={styles.conText}>{comment.description}</Text>
                                                            </View>

                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </ScrollView>

                                        :
                                        <View style={styles.No_Comment}>
                                            <Text style={styles.Text_Comment}>لا توجد تعليقات</Text>
                                        </View>
                                }

                                <TouchableOpacity style={styles.clickMore} onPress={this.toggleModal}>
                                    <Text style={styles.textMore}>مشاهده المزيد</Text>
                                </TouchableOpacity>

                                <Text style={styles.conTitle}>إعلانات مشابهه</Text>

                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                    {
                                        this.state.blocks.map((block, i) => (

                                            // <TouchableOpacity onPress={() =>  this.setAds(block.id)}>
                                            <TouchableOpacity  onPress={() => { this.props.navigation.navigate({routeName: 'detailsadv',params: {id: block.id , vedios: block.vedios},key: 'APage' + i})}}>
                                                <View style={styles.block_section}>
                                                    <View style={styles.section_img}>
                                                        <Image style={styles.image} source={{ uri: block.images }}/>
                                                    </View>
                                                    <View style={styles.Detils_text}>
                                                        <Text style={styles.titles} numberOfLines={1} ellipsizeMode='tail'>{ block.title }</Text>
                                                        <View style={styles.user}>
                                                            <View style={styles.views}>
                                                                <Icon style={styles.icon_user} type="MaterialCommunityIcons" name='map-marker-outline' />
                                                                <Text style={styles.text_user} numberOfLines={1} ellipsizeMode='tail'>{ block.city }</Text>
                                                            </View>
                                                            <Text style={styles.text_user}>{ block.date }</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>

                            </View>

                            <Modal
                                onBackButtonPress={()=> this.setState({
                                    isModalVisible : false
                                })}
                                isVisible={this.state.isModalVisible}
                                style={styles.bgModel}
                                hasBackdrop={false}
                                animationIn={'slideInUp'}
                                animationOut={'slideOutDown'}
                                animationInTiming={1000}
                                animationOutTiming={1000}
                                backdropTransitionInTiming={1000}
                                backdropTransitionOutTiming={1000}
                                swipeDirection="bottom">
                                <View style={styles.contentModel}>
                                    <Image style={[styles.curve , styles.curveModel]} source={require('../../assets/brown_curve.png')}/>
                                    <View style={styles.model}>

                                        <View style={styles.blockModel}>
                                            <Text style={styles.textModel}>المحادثه العامه</Text>
                                            <Text style={styles.countModel}>{ this.state.count }</Text>
                                        </View>


                                        <ScrollView style={{height : 200, width : '100%'}} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{ this.scrollView.scrollToEnd({animated: true})}}>

                                            {
                                                (this.state.allcomment.length > 0)
                                                    ?

                                                    this.state.allcomment.map((come, i) => (
                                                        <View style={styles.viewComment}>
                                                            <View style={styles.imgView}>
                                                                <Image style={styles.img} source={{ uri: come.user_avatar }}/>
                                                            </View>
                                                            <View style={styles.infoComment}>
                                                                <View style={styles.infoComn}>
                                                                    <Text style={styles.titleAdv}>{ come.user_name }</Text>
                                                                    <Text style={styles.conText}>{ come.date }</Text>
                                                                </View>
                                                                <Text style={styles.conText}>{ come.description }</Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                    :
                                                    <View style={styles.No_Comment}>
                                                        <Text style={styles.Text_No_Comment}>لا توجد تعليقات</Text>
                                                    </View>
                                            }


                                        </ScrollView>


                                        {

                                            (this.props.auth)

                                                ?

                                                <View>
                                                    <View style={styles.formComment}>
                                                        <Form style={{ width : '100%', padding : 10 }}>
                                                            <Textarea value={this.state.writecomment} onChangeText={(writecomment)=> this.setState({writecomment: writecomment})} style={styles.write} bordered placeholder="اكتب تعليقك هنا..." />
                                                        </Form>
                                                    </View>
                                                    <View style={styles.blockFunction}>
                                                        <TouchableOpacity style={styles.clickFunction} onPress={() => this.addComment()}>
                                                            <Text style={styles.textFun}>تعليق</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.iconClose} onPress={this.toggleModal}>
                                                            <Text style={styles.textFun}>إغلاق</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                </View>

                                                :

                                                <View>
                                                    <View style={styles.blockFunction}>


                                                        <TouchableOpacity style={styles.iconClose} onPress={this.toggleModal}>
                                                            <Text style={styles.textFun}>إغلاق</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                        }





                                    </View>

                                </View>
                            </Modal>

                        </View>
                    </View>
                </Content>


                <Modal
                    isVisible={this.state.is_video}
                    // onBackdropPress={() => this.setState({ is_video: false })}
                    onBackButtonPress={() => this.setState({ is_video: false })}
                    style={styles.bgModel}
                >

                    <View style={[styles.contentModel , {backgroundColor : 'transparent', top : 0, width : '100%'}]}>

                        <View style={[styles.model, styles.blockVideo, {width : '100%', flex : 1}]}>

                            <Video
                                source          = {{ uri: this.props.navigation.state.params.video }}
                                onLoad          = {()=> console.log('loading')}
                                resizeMode      = "contain"
                                style           = {{ width : '100%', height: '100%', alignItems : 'center', justifyContent : 'center', alignSelf : 'center', }}
                                shouldPlay
                                isLooping
                            />

                            <TouchableOpacity
                                onPress={this.toggleVideo} style={[styles.click_close , {top : 10 , right : 0}]}
                                visible={this.state.is_video}
                            >
                                <Text><Icon style={styles.iconFun} type="AntDesign" name='close' /></Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                </Modal>

                <RNModal onBackButtonPress={()=> this.setState({show_modal : false})} visible={this.state.show_modal}>
                    <ImageViewer imageUrls={this.state.images}/>
                    <TouchableOpacity  onPress={()=> this.setState({show_modal : false})} style={styles.click_close} onBackButtonPress={()=> this.setState({show_modal : false})} visible={this.state.show_modal}>
                        <Text>
                            <Icon style={styles.iconFun} type="AntDesign" name='close' />
                        </Text>
                    </TouchableOpacity>
                </RNModal>

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
        top                 : 25,
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
        top                 : 40,
    },
    upBlock : {
        minHeight           : 90,
    },
    bgDiv : {
        paddingRight        : 10,
        paddingLeft         : 10,
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
    overLay : {
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        width                 : '105%',
        height                : '105%',
        borderWidth           : 1,
        borderColor           : "#DDD",
        borderRadius          : 5,
        backgroundColor       : "rgba(255, 255, 255, 0.6)",
        left                  : -8,
        top                   : -8,
        position              : "absolute",
        zIndex                : -1
    },
    block_slider : {
        width               : '95%',
        margin              : 10,
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        position            : 'relative',
        zIndex              : 9,
        backgroundColor     : "rgba(255, 255, 255, 0.6)",
        padding             : 5,
        borderWidth         : 1,
        borderColor         : "#DDD",
        borderRadius        : 5,



    },
    wrapper : {
        height              : 230,
        width               : '100%',
    },
    slide : {
        width               : "100%",
        height              : 220,
        borderRadius        : 10,
        // resizeMode:  'contain'
    },
    clickFun : {
        position              : "absolute",
        left                  : 5,
        padding               : 5,
        borderTopRightRadius   : 5,
        borderBottomRightRadius: 5,
        zIndex                : 9,
        width                 : 40,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
    },
    iconFun : {
        color                 : "#FFF",
        fontSize              : 16,
    },
    iconRed : {
        color               : "#F00"
    },
    clickShare : {
        backgroundColor       : "rgba(0, 0, 0, 0.7)",
        top                   : 20,
    },
    clickFav : {
        backgroundColor       : "rgba(255, 255, 255, 0.7)",
        top                   : 50,
    },
    clickUpdate : {
        backgroundColor       : "rgba(255, 255, 255, 0.7)",
        top                   : 80,
    },
    colorGreen : {
        color                 : "#4C9A2A"
    },
    Contact : {
        flexDirection         : "row",
        justifyContent        : 'center',
        marginVertical        : 10
    },
    clickNav : {
        padding               : 5,
        borderRadius          : 5,
        flexBasis             : "33%",
        alignItems            : 'center',
        flexDirection         : "row",
        justifyContent        : 'space-between',
        margin                : 2
    },
    bgBlue : {
        backgroundColor       : "#406576"
    },
    bgGreen : {
        backgroundColor       : "#445340"
    },
    bgRed : {
        backgroundColor       : "#532e2e"
    },
    contentInfo : {
        width               : '95%',
        margin              : 10,
        zIndex              : 9,
        backgroundColor     : "rgba(255, 255, 255, 0.6)",
        padding             : 5,
        position            : "relative",
        borderWidth         : 1,
        borderColor         : "#DDD",
        borderRadius        : 5,
        paddingBottom       : 30
    },
    titleAdv : {
        color               : "#694e2f",
        fontFamily          : "CairoRegular",
        fontSize            : 18,
        textAlign           : "center"
    },
    viewBlock : {
        flexDirection       : "row",
        alignItems          : "center"
    },
    conText : {
        color               : "#282828",
        fontFamily          : "CairoRegular",
        fontSize            : 16,
        margin              : 5,
        textAlign           : "left"
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
        fontSize            : 14,
        textDecorationLine  : "underline"
    },
    viewComment : {
        overflow            : "hidden",
        borderRadius        : 10,
        borderWidth         : 1,
        borderColor         : '#DDD',
        margin              : 5,
        flexDirection       : "row",
        justifyContent      : "space-between",
        padding             : 10
    },
    img : {
        width               : 40,
        height              : 40,
        borderRadius        : 100,
        borderColor         : "#DDD",
        borderWidth         : 1,
        resizeMode          : 'cover'
    },
    infoComment : {
        flexBasis           : "80%"
    },
    infoComn : {
        flexDirection       : "row",
        justifyContent      : "space-between",
        alignItems          : "center"
    },
    conTitle : {
        color               : "#fff",
        fontFamily          : "CairoRegular",
        textAlign           : "center",
        fontSize            : 14,
        backgroundColor     : "#504b45",
        width               : 150,
        paddingTop          : 5,
        paddingBottom       : 5,
        borderBottomLeftRadius  : 10,
        borderTopLeftRadius     : 10,
        right               : 10,
        marginVertical      : 10
    },
    block_section : {
        width                 : 150,
        margin                : 5,
        borderRadius          : 10,
        borderWidth           : 1,
        borderColor           : '#DDD',
        overflow              : 'hidden'
    },
    image : {
        width                 : '100%',
        height                : 110
    },
    titles : {
        textAlign             : 'center',
        marginTop             : 4,
        color                 : '#121212',
        fontFamily            : 'CairoRegular',
    },
    user : {
        flexDirection         : 'row',
        justifyContent        : 'space-between',
        width                 : '100%',
        padding               : 10,
        alignItems            : "center"
    },
    text_user : {
        fontFamily            : 'CairoRegular',
        color                 : "#ddd",
        fontSize              : 12,
    },
    icon_user : {
        color                 : '#dba261',
        fontSize              : 12,
    },
    views : {
        flexDirection         : 'row',
        alignItems            : "center"
    },
    blockModel : {
        position              : "relative",
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        top                   : -20
    },
    countModel : {
        position              : "absolute",
        width                 : 25,
        height                : 25,
        lineHeight            : 25,
        borderRadius          : 100,
        top                   : -10,
        right                 : -10,
        backgroundColor       : "#b26363",
        color                 : "#FFF",
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        textAlign             : "center",
    },
    textModel : {
        fontFamily            : 'CairoRegular',
        color                 : "#fff",
        fontSize              : 14,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        backgroundColor       : "#504b45",
        borderRadius          : 10,
        padding               : 5,
        width                 : 120,
        textAlign             : "center"
    },
    contentModel : {
        alignSelf           : 'center',
        width               : "111%",
        backgroundColor     : "#615c56e8",
        flex                : 1,
        top                 : 175
    },
    model : {
        width               : "99%",
    },
    curveModel : {
        opacity             : 0.9,
        top                 : -79,
        width               : '100%',
        height              : 80,
        zIndex              : -1,
        position            : 'absolute',
    },
    formComment : {
        flexDirection         : "row",
        justifyContent        : "center",
        padding               : 10,
        paddingHorizontal     : 20,
        alignItems            : "center",
    },
    write : {
        width                 : '100%',
        fontFamily            : 'CairoRegular',
        textAlign             : 'right',
        backgroundColor       : "rgba(255, 255, 255, 0.6)",
        color                 : "#FFF",
        borderRadius          : 5,
        height                : 40
    },
    btn_click : {
        backgroundColor       : "#dba261",
        borderRadius          : 10,
        margin                : 10,
        padding               : 5,
        width                 : 120,
        justifyContent        : 'center',
    },
    No_Comment : {
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        textAlign             : "center",
        marginVertical        : 20
    },
    Text_No_Comment : {
        fontFamily            : 'CairoRegular',
        color                 : "#FFF",
        fontSize              : 22,
    },
    Text_Comment : {
        fontFamily            : 'CairoRegular',
        color                 : "#363636",
        fontSize              : 22
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
    textFun : {
        color                 : "#fff",
        fontFamily            : "CairoRegular",
        fontSize              : 16,
        textAlign             : "center",
    },
    clickFunction : {
        backgroundColor       : "#dba261",
        borderRadius          : 10,
        margin                : 10,
        padding               : 5,
        width                 : 120,
        justifyContent        : 'center',
    },
    blockFunction : {
        flexDirection         : 'row',
        justifyContent        : 'center',
        alignItems            : 'center'
    },
    click_close : {
        position : 'absolute',
        top : 30,
        backgroundColor : "#f66",
        width : 40,
        height : 40,
        right : 30,
        justifyContent        : 'center',
        alignItems            : 'center',
        borderRadius : 100
    },
    blockVideo : {
        position              : 'relative'
    },
    iconVideo : {
        position              : 'absolute',
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        textAlign             : "center",
        backgroundColor       : "rgba(0, 0, 0, 0.5)",
        width                 : '100%',
        height                : '100%',
        zIndex                : 99
    }
});


// export default DetailsAdv;
const mapStateToProps = ({ auth,profile  }) => {

    return {

        auth      : auth.user,
        result    : auth.success,
        userId    : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(DetailsAdv);